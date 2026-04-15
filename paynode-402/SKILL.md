---
name: paynode-402
description: Dynamic Premium API Marketplace for AI Agents. Grants access to an ever-expanding registry of real-time external tools (e.g., web search, crypto oracles, web scraping, and more) via USDC micro-payments. Use this WHENEVER you need real-time data, external API interactions, or when your built-in knowledge is insufficient.
version: 2.7.1
homepage: https://github.com/PayNodeLabs/paynode-402-cli
metadata:
  openclaw:
    requires:
      env:
        - CLIENT_PRIVATE_KEY
      config:
        - "~/.config/paynode/config.json"
      bins:
        - bun
    primaryEnv: CLIENT_PRIVATE_KEY
    cliHelp: |
      Usage: bunx @paynodelabs/paynode-402-cli [command]
      Commands:
        check              Check wallet readiness (ETH/USDC)
        mint               Mint test USDC
        request <URL>      Access protected API
        list-paid-apis     Marketplace discovery
        invoke-paid-api    Execution flow
        tasks              Manage background tasks
---

# 💳 PayNode 402 CLI Skill (v2.7.0)

> Official ClawHub-compliant skill for PayNode protocol execution.

## ⚠️ Security Warning

Before installing or activating this skill, please review the following critical security considerations:

- **Burner Wallet ONLY**: Never provide a high-value primary key in `CLIENT_PRIVATE_KEY`. Always use a dedicated burner address with minimal funds.
- **Config File Fallback**: This skill reads `~/.config/paynode/config.json` if the env var is missing. Ensure you verify the contents of this file in your environment.
- **Runtime Fetching**: The CLI `@paynodelabs/paynode-402-cli` is fetched dynamically via `bunx`. For strict supply chain control, verify the upstream [GitHub](https://github.com/PayNodeLabs/paynode-402-cli) and [npm](https://www.npmjs.com/package/@paynodelabs/paynode-402-cli) package before execution.
- **Agent Autonomy**: Since the platform allows agents to call skills autonomously, an agent might execute Testnet payments or attempt Mainnet flows without direct supervision. To prevent unexpected spending, avoid setting long-term environment variables or disable autonomous skill invocation for untrusted agents.
- **Sandbox First**: Always test in a sandbox or with Testnet (`--network testnet`) before proceeding to real-value transactions.

This skill provides autonomous payment capabilities for HTTP 402 (Payment Required) challenges on Base L2.

## 🛠️ Setup & Config (Mandatory)

To ensure this skill can sign transactions even in non-interactive shells (like OpenClaw Gateway), it supports a dual-layer configuration priority:

1. **Priority B (Environment Variable)**: The CLI will first check for `CLIENT_PRIVATE_KEY` in your system environment.
2. **Priority A (XDG Config Fallback)**: If the env var is missing, it will automatically search for a JSON config at: `~/.config/paynode/config.json`.
   - **Format**: `{"CLIENT_PRIVATE_KEY": "0x..."}`

**Recommendation**: Use **Priority B** for dynamic/containerized environments, and **Priority A** for persistent local development or cases where `.bashrc` is not sourced.

## 🛡️ Security Governance (Critical)

To comply with **ClawHub Safety Standards**, the Agent MUST strictly follow these protocols:

1. **Burner Wallet ONLY**: Never use high-value primary keys. Advise users to use a dedicated burner address with minimal USDC/ETH for this skill.
2. **Mainnet YES-Confirmation**: Before calling `request` or `invoke-paid-api` on **Mainnet**, the Agent MUST explicitly prompt the user: "Allow payment of <PRICE> on Mainnet?". Proceed ONLY on "YES".
3. **Data Path Isolation**: The `data_binary` field returns a local filesystem path. Only read this path if generated during the current session's request.
4. **No Parameter Hallucination**: ALWAYS call `get-api-detail <ID>` to fetch the correct `input_schema` and `sample_response` before execution.
5. **Clean Logs**: The CLI (v2.7.0+) automatically silences internal logs in `--json` mode. You should expect pure, parseable JSON on `stdout`.
6. **Financial Optimization (CRITICAL)**: Paid APIs cost real USDC. YOU MUST NOT call the same paid API multiple times for the same context. ALWAYS pipe output to a temporary file (e.g., `... > /tmp/res.json`) and parse locally to save costs.

## 🤖 Agent Action Triggers & Discovery Protocol

PayNode is a DYNAMIC marketplace. The available APIs and capabilities change and expand over time. You must adopt a "Discovery-First" approach.

**WHEN TO USE THIS SKILL:**

1. **Knowledge Gap:** If the user asks for real-time data, current events, live market prices, or content behind URLs that you cannot access natively.
2. **Specialized Tasks:** If the user requests specialized processing (e.g., data extraction, blockchain analytics, specific third-party integrations).

**STANDARD WORKFLOW (The "Check Before Giving Up" Rule):**

- Step 1 (Discovery): NEVER tell the user "I don't have access to real-time internet" or "I cannot do that" without FIRST checking the marketplace. Run `list-paid-apis --network mainnet --json` to explore available tools.
- Step 2 (Analysis): Use `get-api-detail <ID>` to fetch the full manifest. **Pay attention to `sample_response`** to understand the data structure you will receive. The CLI handles `headers_template` automatically, so you don't need to manually set headers defined by the merchant.
- Step 3 (Execution): Ask for user permission (showing the price), then use `invoke-paid-api` to fulfill the request.

## 🚀 Cold Start (Discovery Phase)

The first action MUST be indexing the marketplace (**Outbound discovery**). Use this to explore current premium tools:

```bash
bunx @paynodelabs/paynode-402-cli list-paid-apis --network mainnet --json --limit 10
```

## 📋 Command Reference

| Command           | Usage Example                             | Purpose                                          |
| :---------------- | :---------------------------------------- | :----------------------------------------------- |
| `list-paid-apis`  | `list-paid-apis --network mainnet --json` | **DISCOVERY**: Explore available tools           |
| `get-api-detail`  | `get-api-detail <ID> --json`              | **REQUIRED**: Fetch schema, sample_res & pricing |
| `invoke-paid-api` | `invoke-paid-api <ID> --json`             | **EXECUTION**: Auto-handles headers & payment    |
| `check`           | `check --network mainnet --json`          | Balance readiness (silenced logs)                |
| `request`         | `request <URL> key=val --json`            | Access protected 402 URL (Low-level)             |
| `tasks`           | `tasks list`                              | Async progress monitor                           |
| `mint`            | `mint --amount 100 --json`                | Get test tokens (Base Sepolia)                   |

### 🛠️ Global Flags

- `--network <mainnet|testnet>`: Target (Default: testnet).
- `--confirm-mainnet`: Required for real USDC.
- `--json`: Required for agent parsing.

---

## 🔗 Resources

- **GitHub**: [PayNodeLabs/paynode-402-cli](https://github.com/PayNodeLabs/paynode-402-cli)
- **Faucet**: [Base Official Faucets](https://docs.base.org/docs/development/faucets)
- **NPM**: [@paynodelabs/paynode-402-cli](https://www.npmjs.com/package/@paynodelabs/paynode-402-cli)
- **Protocol**: [PayNode Specification](https://docs.paynode.dev)
