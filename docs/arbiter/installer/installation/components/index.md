# Components Overview

!!! warning "Content in Development"
    This content is being migrated from the source repository. Please check the [Verdikta Arbiter repository](https://github.com/verdikta/verdikta-arbiter) for the latest component information.

## Arbiter Components

### 1. AI Node Service
- **Purpose**: Processes disputes using multiple AI models
- **Technology**: Next.js application with API endpoints
- **Models**: GPT-4, Claude-3, local models

### 2. External Adapter
- **Purpose**: Bridges Chainlink node with AI processing
- **Technology**: Node.js service
- **Features**: IPFS integration, multi-CID support

### 3. Chainlink Node
- **Purpose**: Blockchain oracle functionality
- **Technology**: Standard Chainlink core
- **Configuration**: Custom job specifications

### 4. Smart Contracts
- **Purpose**: On-chain arbitration logic
- **Network**: Base Mainnet (production) or Base Sepolia (testnet)
- **Features**: Reputation management, dispute handling

## Component Interaction

```mermaid
graph LR
    A[Smart Contract] --> B[Chainlink Node]
    B --> C[External Adapter]
    C --> D[AI Node Service]
    D --> E[AI Models]
```

## Resource Requirements

| Component | CPU | RAM | Storage |
|-----------|-----|-----|---------|
| AI Node | 1 core | 2GB | 10GB |
| External Adapter | 0.5 core | 1GB | 5GB |
| Chainlink Node | 1 core | 2GB | 20GB |
| **Total** | **2.5 cores** | **5GB** | **35GB** | 