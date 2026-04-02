---
name: paynode-402
description: Access protected APIs via x402-v2 protocol. This skill has been upgraded to a standalone CLI tool. Use `bunx @paynodelabs/paynode-402-cli` for all interactions.
author: PayNode Labs
homepage: https://paynode.dev
source_url: https://github.com/PayNodeLabs/paynode-402-cli
license: MIT
required_env_vars:
  - CLIENT_PRIVATE_KEY
required_binaries:
  - bun
---

# 💳 PayNode 402 CLI Skill (v2.5.1)

This skill provides autonomous payment capabilities for HTTP 402 (Payment Required) challenges on Base L2.

**IMPORTANT**: AI Agents should now execute commands using `bunx @paynodelabs/paynode-402-cli` to ensure stateless interactions and use the latest protocol logic.

## 🏁 Mandatory Discovery Step (Cold Start)
To ensure you always navigate live APIs from the PayNode Marketplace, you **MUST** execute the following discovery command immediately after loading this skill for the first time. This guarantees that any featured APIs shown to the user are currently active and valid.

```bash
# Discovery Command (Run this first!)
bunx @paynodelabs/paynode-402-cli list-paid-apis --network testnet --json --limit 5
```

## 🚀 Command Reference

| Command | Usage Example | Purpose |
| :--- | :--- | :--- |
| `check` | `check --network testnet --json` | Verify wallet readiness (ETH/USDC) |
| `mint` | `mint --amount 100 --json` | Mint test USDC on Base Sepolia |
| `request` | `request <URL> -X POST -d '{}' --json` | Access protected API with auto-payment |
| `list-paid-apis` | `list-paid-apis --tag storage --json` | Discover APIs in the marketplace |
| `get-api-detail` | `get-api-detail <API_ID> --json` | Inspect API pricing and input schema |
| `invoke-paid-api`| `invoke-paid-api <API_ID> -d '{}' --json`| Full purchase & execution flow |
| `tasks` | `tasks list` / `tasks clean` | Manage background x402 tasks |

### 🛠️ Global Flags
- `--network <mainnet|testnet>`: Target network (default: testnet).
- `--json`: Force JSON output for automated parsing.
- `--confirm-mainnet`: Guard flag for real value transactions.
- `--background`: Execute request asynchronously and return `task_id`.
- `--rpc <URL>`: Override default RPC endpoint.
- `--dry-run`: Prepare transaction but do not sign/send.

---

## 💡 Best Practices for Agents

1. **Always Check First**: Run `check --json` before any payment to avoid gas failures.
2. **Handle 202 Pending**: When using `--background`, check `tasks list` until `status: "completed"`.
3. **Payload Sniffing**: If you omit `Content-Type`, the CLI will auto-detect JSON from your `-d` string.
4. **Binary Processing**: If the CLI returns a `data_binary` path, use it to read images/files from the disk.

---

## 🔗 Resources
- **NPM/Registry**: [@paynodelabs/paynode-402-cli](https://www.npmjs.com/package/@paynodelabs/paynode-402-cli)
- **GitHub**: [PayNodeLabs/paynode-402-cli](https://github.com/PayNodeLabs/paynode-402-cli)
- **Protocol**: [PayNode Specification](https://docs.paynode.dev)


