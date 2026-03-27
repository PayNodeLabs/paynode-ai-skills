# PayNode AI Skills

Collect and manage standardized AI skills for the PayNode ecosystem. These skills are designed for seamless integration into AI agents, supporting automated USDC transactions and resource-based billing on the Base L2 network.

## Navigation

| Skill | Name                     | Description                                                                                          |
| :---- | :----------------------- | :--------------------------------------------------------------------------------------------------- |
| 💳    | [**payment-402**](./paynode-402) | Access protected resources via the x402 protocol on Base (automated micro-payments, balance checks). |

## General Skill Specification

Each skill folder follows a standardized structure:

- **SKILL.md**: The core definition and instruction file for AI agents.
- **scripts/**: TypeScript source code for specific procedures.
- **references/**: Documentation and setup guides for testing/debugging.
- **package.json**: Dependency management.

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
