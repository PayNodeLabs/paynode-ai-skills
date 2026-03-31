import { requestAction } from './request.ts';
import { MarketplaceClient } from '../marketplace/client.ts';
import { reportError, EXIT_CODES } from '../utils.ts';

interface InvokePaidApiOptions {
  json?: boolean;
  network?: string;
  marketUrl?: string;
  confirmMainnet?: boolean;
  rpc?: string;
  method?: string;
  data?: string;
  header?: string | string[];
  background?: boolean;
  dryRun?: boolean;
  output?: string;
  maxAge?: number;
  taskDir?: string;
  taskId?: string;
}

function mergeHeaders(
  marketplaceHeaders: Record<string, string> | undefined,
  cliHeader: string | string[] | undefined
): string[] {
  const merged: string[] = [];

  for (const [key, value] of Object.entries(marketplaceHeaders || {})) {
    merged.push(`${key}: ${value}`);
  }

  if (Array.isArray(cliHeader)) {
    merged.push(...cliHeader);
  } else if (cliHeader) {
    merged.push(cliHeader);
  }

  return merged;
}

function parsePayload(data?: string): any {
  if (!data) return {};

  try {
    return JSON.parse(data);
  } catch {
    return { raw: data };
  }
}

export async function invokePaidApiAction(apiId: string, options: InvokePaidApiOptions) {
    const isJson = !!options.json;

  try {
    const client = new MarketplaceClient({
      baseUrl: options.marketUrl,
      json: isJson
    });

    const invoke = await client.prepareInvoke(apiId, {
      network: options.network,
      payload: parsePayload(options.data)
    });

    const requestHeaders = mergeHeaders(invoke.headers, options.header);
    const hasPreparedBody = invoke.body && Object.keys(invoke.body).length > 0;
    const requestBody = hasPreparedBody 
      ? JSON.stringify(invoke.body) 
      : options.data; // [P0] Preserve CLI data if no prepared body (prefer user input)

    await requestAction(invoke.invoke_url, [], {
      json: options.json,
      network: options.network || invoke.network,
      rpc: options.rpc,
      confirmMainnet: options.confirmMainnet,
      method: options.method || invoke.method || 'POST',
      data: requestBody,
      header: requestHeaders,
      background: options.background,
      dryRun: options.dryRun,
      output: options.output,
      maxAge: options.maxAge,
      taskDir: options.taskDir,
      taskId: options.taskId
    });
  } catch (error: any) {
    reportError(error, isJson, EXIT_CODES.NETWORK_ERROR);
  }
}
