# Verdikta Overview

## System Architecture

Verdikta is built as a modular ecosystem with several key components working together to provide decentralized AI-powered dispute resolution.

### Core Components

1. **Verdikta Dispatcher** - Smart contract system for managing disputes and reputation
2. **Arbiter Oracles** - Chainlink-based nodes enhanced with AI capabilities
3. **AI Processing Engine** - Advanced language models for decision making
4. **Integration Layer** - SDKs and APIs for developers

### Supported Networks

- **Base Sepolia** (Testnet) - Currently active for testing
- **Ethereum Mainnet** (Coming Soon) - Planned deployment
- **Polygon** (Planned) - Future expansion

## How It Works

```mermaid
sequenceDiagram
    participant Client as Client App
    participant Dispatcher as Verdikta Dispatcher
    participant Oracle as Arbiter Oracle
    participant AI as AI Engine
    participant Chain as Blockchain
    
    Client->>Dispatcher: Submit Dispute
    Dispatcher->>Oracle: Request Arbitration
    Oracle->>AI: Process Evidence
    AI->>Oracle: Return Decision
    Oracle->>Dispatcher: Submit Judgment
    Dispatcher->>Chain: Record Result
    Chain->>Client: Execute Outcome
```

### Step-by-Step Process

1. **Dispute Creation**: Users submit disputes through smart contracts with evidence stored on IPFS. In v2 the request also carries its jury (K drawn, M promoted, N counted, P clustered, and a timeout) and escrows the fees in ETH
2. **Oracle Assignment**: From two blocks after the request, anyone calls `drawJury`. The keeper draws K arbiters, weighted by reputation and fee, from the arbiters eligible at the request block, using a seed from the next block's hash (optionally mixed with jury beacons), so nobody can predict or re-roll the jury when the request is sent
3. **AI Processing**: Advanced AI models analyze evidence and arguments from multiple perspectives
4. **Decision Making**: Each arbiter commits to a hash of its answer, bound to the round. Once enough commits are in, M of them are drawn at random to reveal; the N-th counted reveal finalizes the round, and the result is the mean of the P closest reveals (the cluster)
5. **Settlement**: Results are recorded on-chain and trigger automatic execution. After the round's deadline, settlement updates every juror's reputation in one keeper call

## Key Innovations

### Multi-Model AI Deliberation
- Multiple AI models from different providers analyze each dispute
- Weighted voting system based on model performance and specialization
- Bias reduction through diverse perspectives

### Reputation-Based Selection
- Arbiters build two scores over time: quality (closeness to the round's median) and timeliness (delivering promoted reveals, and committing)
- Selection is weighted by those scores and by fee, from the arbiters registered in the requested class, staked, and answering their health calls
- Economic incentives align with fair decision-making: clustered arbiters earn a bonus, and a score that reaches 0 blocks the arbiter

### Blockchain Integration
- All decisions permanently recorded on-chain
- Automatic execution of outcomes through smart contracts
- Transparent and verifiable arbitration process

## Use Cases

### E-commerce Disputes
- Product quality disagreements
- Delivery and shipping issues
- Refund and return disputes

### Service Agreements
- Freelance work disputes
- Service quality issues
- Payment disagreements

### Insurance Claims
- Automated claim processing
- Fraud detection
- Coverage disputes

### Supply Chain
- Quality control disputes
- Delivery timing issues
- Contract compliance

## Benefits

### For Users
- **Fast Resolution**: Minutes instead of months
- **Low Cost**: Fraction of traditional arbitration fees
- **Fair Outcomes**: AI reduces human bias and emotions
- **Transparent Process**: All decisions publicly verifiable

### For Developers
- **Easy Integration**: Simple APIs and SDKs
- **Flexible Deployment**: Works with existing smart contracts
- **Scalable Solution**: Handles high volume of disputes
- **Customizable**: Tailor arbitration logic to specific needs

### For Node Operators
- **Earn Rewards**: Get paid for providing arbitration services
- **Build Reputation**: Develop standing in the ecosystem
- **Low Barriers**: Easy setup with automated tools
- **Passive Income**: Earn while providing valuable service

## Technical Specifications

### Performance Metrics
- **Resolution Time**: < 10 minutes average
- **Throughput**: 1000+ disputes per hour per arbiter
- **Availability**: 99.9% uptime target
- **Cost**: ~$1-5 per dispute (vs $100-1000 traditional)

### Security Features
- **Commit–reveal**: Each arbiter commits `keccak256(abi.encode(aggId, operator, response, salt))` before any answer is revealed, so no arbiter can copy another or change its answer
- **Unpredictable juries**: The jury is drawn after the request from a block hash, and the reveals from the commits by a later block hash
- **Cryptographic proofs**: All evidence cryptographically verified
- **Immutable records**: Blockchain ensures tamper-proof decisions
- **Access controls**: Role-based permissions and authentication

## Getting Started

Ready to integrate Verdikta into your application or become a node operator?

- **Developers**: Start with our [API documentation](../apps/index.md)
- **Node Operators**: Follow our [installation guide](../verdikta-arbiter-node-installation-guide/index.md)
- **Smart Contract Developers**: Review our [contract documentation](../verdikta-dispatcher-smart-contracts/index.md)