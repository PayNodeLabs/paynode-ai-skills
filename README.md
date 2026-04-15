# PayNode AI Skills

Collect and manage standardized AI skills for the PayNode ecosystem. These skills are designed for seamless integration into AI agents, supporting automated USDC transactions and resource-based billing on the Base L2 network.

## Navigation

| Skill | Name                             | Description                                                                                          |
| :---- | :------------------------------- | :--------------------------------------------------------------------------------------------------- |
| 💳    | [**payment-402**](./paynode-402) | Access protected resources via the x402 protocol on Base (automated micro-payments, balance checks). |

## General Skill Specification

Each skill folder follows a standardized structure and **MUST** strictly adhere to the [ClawHub Skill Format](https://github.com/openclaw/clawhub/blob/main/docs/skill-format.md):

- **SKILL.md**: The core definition and instruction file. Must include valid YAML frontmatter (name, description, version, and `metadata.openclaw` for env/bins).
- **scripts/**: TypeScript source code for specific procedures.
- **package.json**: Dependency management.

All `SKILL.md` files must declare their required environment variables (e.g., `CLIENT_PRIVATE_KEY`) in the frontmatter to pass security and runtime validation.

## Getting Started

Skills are written in TypeScript and designed to run with [Bun](https://bun.sh/).

```bash
# Enter a skill directory
cd payment-402

# Install dependencies
bun install
```

## License

MIT
