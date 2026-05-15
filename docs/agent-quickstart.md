# Integrating Verdikta into Your Agent Stack: A Developer Quickstart

## What Problem Verdikta Solves

When building AI agents that interact autonomously — whether they're negotiating, hiring subcontractors, or verifying deliverables — you need a way to resolve disputes when agents disagree. Traditional approaches break down in agent-to-agent economies:

- **Human-in-the-loop** doesn't scale when agents execute thousands of micro-transactions per hour
- **Centralized arbitration** creates bottlenecks and single points of failure
- **Simple voting** is gameable and doesn't account for expertise

Verdikta provides decentralized dispute resolution built for autonomous agents.

## Quick Start

### Installation

```bash
npm install @verdikta/sdk
# or
pip install verdikta-sdk
```

### Basic Integration

```typescript
import { VerdiktaClient } from '@verdikta/sdk';

const client = new VerdiktaClient({
  network: 'testnet',
  agentId: 'your-agent-id',
});

// Raise a dispute
const dispute = await client.createDispute({
  type: 'delivery_quality',
  claim: 'Deliverable does not meet specifications',
  evidence: [
    { type: 'screenshot', url: 'https://...' },
    { type: 'log', content: 'Agent execution log...' },
  ],
  requestedResolution: 'partial_refund',
  amount: 500,
});

// Submit evidence
await dispute.addEvidence({
  type: 'contract',
  content: JSON.stringify(originalAgreement),
});

// Get resolution
const resolution = await dispute.waitForResolution();
console.log('Resolution:', resolution.outcome);
```

### Agent Configuration

```typescript
const agent = {
  disputePolicy: {
    autoRaise: true,
    maxDisputeAmount: 10000,
    evidenceCollection: 'automatic',
    preferredResolution: 'arbitration',
  },
};
```

## Architecture

```
Your Agent → Verdikta SDK → Dispute Layer → Arbitrator Pool → Resolution
                                    ↓
                              Evidence Store
                                    ↓
                              Verdict Oracle
```

## API Reference

### `createDispute(options)`

Creates a new dispute and submits it to the resolution pool.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Category of dispute |
| claim | string | Yes | Description of the issue |
| evidence | Evidence[] | No | Initial evidence package |
| amount | number | Yes | Value at stake |

### `addEvidence(evidence)`

Adds evidence to an existing dispute.

### `waitForResolution(timeout?)`

Waits for the dispute to be resolved and returns the verdict.

## Best Practices

1. **Collect evidence proactively** — Don't wait for disputes to gather data
2. **Set dispute thresholds** — Not every disagreement needs formal resolution
3. **Use appropriate dispute types** — Correct categorization speeds up resolution
4. **Cache resolutions** — Learn from past disputes to prevent future ones

## Next Steps

- Explore the [API Reference](/api/)
- Read about [Dispute Types](/disputes/)
- Join the [Discord community](https://discord.gg/verdikta)
