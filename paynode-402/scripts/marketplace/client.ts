import { jsonEnvelope, reportError, withRetry, EXIT_CODES } from '../utils.ts';
import type { CatalogApiItem, CatalogListResponse, InvokePreparation } from './types.ts';

export interface MarketplaceClientOptions {
  baseUrl?: string;
  json?: boolean;
}

export interface ListCatalogOptions {
  network?: string;
  limit?: number;
  tag?: string[];
  seller?: string;
}

export interface PrepareInvokeOptions {
  network?: string;
  payload?: any;
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function normalizeCatalogItem(raw: any): CatalogApiItem {
  return {
    id: raw.id || raw.api_id,
    name: raw.name || raw.title || raw.api_name || raw.api_id,
    description: raw.description,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    price_per_call: raw.price_per_call || raw.price || raw.amount,
    currency: raw.currency || 'USDC',
    network: raw.network,
    seller: raw.seller || {
      name: raw.seller_name,
      wallet_address: raw.wallet_address
    },
    method: raw.method || raw.http_method,
    payable_url: raw.payable_url || raw.payment_url,
    invoke_url: raw.invoke_url,
    input_schema: raw.input_schema,
    sample_response: raw.sample_response,
    headers_template: raw.headers_template,
    ...raw
  };
}

export class MarketplaceClient {
  private readonly baseUrl: string;
  private readonly isJson: boolean;

  constructor(options: MarketplaceClientOptions = {}) {
    this.baseUrl = options.baseUrl || process.env.PAYNODE_MARKETPLACE_URL || '';
    this.isJson = !!options.json;

    if (!this.baseUrl) {
      reportError(
        'PAYNODE_MARKETPLACE_URL is not configured. Set it in the environment or pass --market-url.',
        this.isJson,
        EXIT_CODES.INVALID_ARGS
      );
    }
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = joinUrl(this.baseUrl, path);
    const response = await withRetry(
      () => fetch(url, init),
      `marketplace:${path}`
    );

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `Marketplace request failed (${response.status}) at ${path}: ${text || 'empty response'}`;
      try {
        const json = JSON.parse(text);
        if (json.message) errorMessage = json.message;
        const err = new Error(errorMessage) as any;
        err.status = response.status;
        err.code = json.code || json.error;
        throw err;
      } catch {
        throw new Error(errorMessage);
      }
    }

    return await response.json() as T;
  }

  async listCatalog(options: ListCatalogOptions = {}): Promise<CatalogListResponse> {
    const url = new URL(joinUrl(this.baseUrl, '/api/v1/paid-apis'));
    if (options.network) url.searchParams.set('network', options.network);
    if (options.limit) url.searchParams.set('limit', String(options.limit));
    if (options.seller) url.searchParams.set('seller', options.seller);
    for (const tag of options.tag || []) {
      url.searchParams.append('tag', tag);
    }

    const response = await withRetry(
      () => fetch(url.toString()),
      'marketplace:list'
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Marketplace catalog request failed (${response.status}): ${body || 'empty response'}`);
    }

    const raw = await response.json() as any;
    const items = Array.isArray(raw.items)
      ? raw.items.map(normalizeCatalogItem)
      : Array.isArray(raw)
        ? raw.map(normalizeCatalogItem)
        : [];

    return {
      items,
      total: raw.total || items.length
    };
  }

  async getApiDetail(apiId: string): Promise<CatalogApiItem> {
    const raw = await this.request<any>(`/api/v1/paid-apis/${encodeURIComponent(apiId)}`);
    return normalizeCatalogItem(raw);
  }

  async prepareInvoke(apiId: string, options: PrepareInvokeOptions = {}): Promise<InvokePreparation> {
    try {
      const preparation = await this.request<InvokePreparation>(`/api/v1/paid-apis/${encodeURIComponent(apiId)}/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          network: options.network,
          payload: options.payload || {}
        })
      });

      if (!preparation.invoke_url) {
        throw new Error('Preparation response missing invoke_url');
      }

      return preparation;
    } catch (err: any) {
      console.warn(`[Marketplace] /invoke preparation failed for ${apiId}, falling back to direct proxy. Error: ${err.message}`);
      const detail = await this.getApiDetail(apiId);
      const invokeUrl = detail.payable_url || detail.invoke_url;
      if (!invokeUrl) {
        throw new Error(`API '${apiId}' is missing payable_url/invoke_url and marketplace did not provide an invoke preparation.`);
      }

      return {
        api_id: detail.id,
        invoke_url: invokeUrl,
        method: detail.method || 'POST',
        headers: detail.headers_template || {},
        body: options.payload || {}
      };
    }
  }
}
