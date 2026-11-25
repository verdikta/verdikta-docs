# Release Notes

Detailed release notes for all Verdikta ecosystem components.

## Unreleased: Protocol v2

*In development on the `beacon` branches. Not audited and not deployed yet: the v2 addresses will be published at
the v2 deployment, and every address in use today is v1.* v2 is a redeploy, not an upgrade. The dispatcher
repository's `reputationBasedAggregator/MIGRATION.md` lists what each consumer must change.

### For requesters and integrating contracts

- `requestAIEvaluationWithApproval(cids, addendumText, alpha, maxFee, minFee, estimatedBaseCost,
  maxFeeBasedScalingFactor, requestedClass, withBeacons, jury)`, with `jury = (K, M, N, P, timeout)`. The request
  reverts with `BadJury` unless K >= M >= N >= P >= 1, N <= 40, P >= 2 unless N = 1, K <= `maxJury()` (50) and the
  keeper's `shortlistSize()` (60), and `tPlus()` (155 s) < timeout <= `maxTimeout()` (3,600 s), with
  the timeout at most one day (86,400 s) whatever `maxTimeout()` says.
- The escrow is `maxTotalFee(maxFee, minFee, withBeacons, K, P)` in ETH. The aggregator has no `K()`, `M()`, `N()`,
  `P()` or `responseTimeoutSeconds()`; `getJury(aggId)` returns a round's jury.
- The round moves on through permissionless calls: `drawJury` (from block B+2; twice with beacons), `closeCommits`
  (after T+ if needed), `promote` (from block C+2), and `settle` after the deadline, which replaces
  `finalizeEvaluationTimeout`. `getRoundInfo(aggId)` replaces `getAggregationStatus`.
- A fee floor `minFee`: every juror, and every used beacon, is paid at least the floor.
- A thin pool repeats arbiters to fill the jury; the draw fails only when no arbiter is eligible.

### For arbiter operators

- Registration: `registerArbiter(oracle, jobId, fee, classes, chainHead)` pulls the stake (`stakeRequirement()`, 100 wVDKA by default) and
  replaces `registerOracle`. `requestExit` and `completeExit` (after 2 days) replace `deregisterOracle`;
  `setPaused` replaces `setOracleActive`. Each operator owner calls `addReputationKeeper(<v2 keeper>)`.
- Commit `keccak256(abi.encode(aggId, operator, response, salt))`, all 32 bytes, with a fresh 16-byte salt; the
  reveal CID is `<cid>:<32 hex>` and the reveal request is `2:<64 hex>`. A commit in the v1 format is accepted but
  can never be revealed.
- A health job answers the keeper's `HealthCall` with the next value of the arbiter's hash chain, within 60 s.
- The request job's gas limit is 9M: the N-th counted reveal pays for the clustering.
- One-number answers: a one-outcome question is answered `[score]`, from 0 to 1,000,000, not scaled.

---

## v0.3.0 - Documentation Site Launch
*Released: January 15, 2025*

### 🎉 Major Features

#### New Documentation Site
- **Unified Documentation**: All Verdikta project documentation now available at docs.verdikta.org
- **MkDocs Material**: Modern, responsive documentation framework with advanced search
- **Monorepo Support**: Content aggregated from multiple repositories automatically
- **Mobile Optimized**: Full mobile experience with touch-friendly interface

#### Enhanced Content
- **Installation Guides**: Step-by-step guides for all user types
- **API Documentation**: Comprehensive API reference with examples
- **Architecture Docs**: Deep technical documentation for developers
- **Troubleshooting**: Common issues and solutions

### 🔧 Technical Improvements

#### Build System
- **Automated Updates**: GitHub Actions automatically update content from source repos
- **Vercel Deployment**: Fast, reliable hosting with edge caching
- **Version Control**: All documentation changes tracked in git
- **CI/CD Pipeline**: Automated testing and deployment

#### Developer Experience
- **Search Functionality**: Instant search across all documentation
- **Code Highlighting**: Syntax highlighting for all languages
- **Interactive Examples**: Copy-paste code examples
- **Navigation**: Improved site structure and navigation

### 🐛 Documentation Fixes
- Fixed broken links in installation guides
- Corrected code examples in API documentation
- Updated network information for Base Sepolia
- Improved formatting and readability

---

## v0.2.1 - Beta System Improvements
*Released: December 8, 2024*

### 🚀 Performance Improvements

#### AI Processing Engine
- **Memory Optimization**: 40% reduction in memory usage during AI model processing
- **Faster Processing**: Improved model loading times by 25%
- **Better Caching**: Reduced redundant API calls to AI service providers
- **Resource Management**: Better cleanup of temporary processing files

#### External Adapter
- **IPFS Optimization**: Faster retrieval of evidence packages from IPFS
- **Connection Pooling**: Reuse connections to reduce latency
- **Retry Logic**: Improved error recovery for network issues
- **Timeout Handling**: Better timeout management for slow responses

### 🔒 Security Enhancements
- **Input Validation**: Enhanced validation of all external inputs
- **Error Sanitization**: Prevent information leakage through error messages
- **Dependency Updates**: Updated all dependencies to latest secure versions
- **Access Logging**: Improved audit trail for all system access

### 🐛 Bug Fixes

#### Critical Fixes
- **Memory Leaks**: Fixed memory leaks in long-running AI processing tasks
- **IPFS Timeouts**: Resolved timeout issues when retrieving large evidence files
- **Database Connections**: Fixed connection pool exhaustion under high load
- **Error Handling**: Improved error recovery in network communication

#### Minor Fixes
- Fixed logging timestamps in external adapter
- Corrected configuration validation messages
- Improved error messages for common user mistakes
- Fixed race condition in multi-model AI processing

### 📝 Documentation Updates
- Updated installation troubleshooting guide
- Added performance tuning recommendations
- Improved error code documentation
- Added monitoring and alerting guides

---

## v0.2.0 - Initial Beta Release
*Released: November 15, 2024*

### 🎉 Major Features

#### Core Arbitration System
- **Smart Contracts**: Complete dispute resolution contract suite deployed on Base Sepolia
- **Oracle Integration**: Chainlink oracle network for blockchain-AI bridge
- **AI Deliberation**: Multi-model consensus system using GPT-4, Claude-3, and local models
- **Reputation System**: Arbiter scoring and selection based on historical performance

#### Node Infrastructure
- **Arbiter Nodes**: Complete node software for running arbitration services
- **Installation System**: Automated installer for Ubuntu, macOS, and WSL2
- **Management Tools**: Scripts for starting, stopping, and monitoring node services
- **Configuration Management**: Environment-based configuration system

#### Evidence System
- **IPFS Integration**: Decentralized storage for dispute evidence and attachments
- **Multi-CID Support**: Handle complex disputes with multiple evidence packages
- **Cryptographic Verification**: All evidence cryptographically signed and verified
- **Format Support**: Text, images, documents, and structured data

### 🔧 Technical Implementation

#### Smart Contract Suite
- **VerdiktaDispatcher.sol**: Main orchestration contract (Gas optimized)
- **ReputationManager.sol**: Arbiter reputation and scoring system
- **DisputeFactory.sol**: Factory pattern for creating dispute instances
- **AccessControl.sol**: Role-based permissions and security

#### AI Processing
- **Model Integration**: Support for OpenAI GPT-4, Anthropic Claude-3, and Ollama
- **Consensus Algorithm**: Weighted voting based on model performance and confidence
- **Justification Generation**: Detailed reasoning for all decisions
- **Bias Reduction**: Multiple models reduce individual model biases

#### Oracle Network
- **Chainlink Integration**: Standard Chainlink external adapter pattern
- **Job Specifications**: TOML-based job specs for different dispute types
- **Error Recovery**: Robust error handling and retry mechanisms
- **Monitoring**: Comprehensive logging and health checks

### 📊 Performance Metrics
- **Resolution Time**: Average 8 minutes from submission to final decision
- **Throughput**: Up to 100 disputes per hour per arbiter node
- **Accuracy**: 94% agreement with human arbitrator benchmark tests
- **Uptime**: 99.2% availability during beta testing period

### 🔒 Security Features
- **Multi-Signature**: Decisions require consensus from multiple arbiters
- **Stake-Based Security**: Arbiters must stake tokens to participate
- **Cryptographic Proofs**: All evidence and decisions cryptographically verified
- **Access Controls**: Role-based permissions throughout the system

### 🐛 Known Issues
- **High Load**: Performance degradation under very high dispute volumes
- **Model Timeouts**: Occasional timeouts with slower AI model providers
- **IPFS Latency**: Variable latency for large evidence files
- **Gas Optimization**: Some contract functions could be further optimized

### 📈 Beta Testing Results
- **Disputes Processed**: 1,247 test disputes during beta period
- **Node Operators**: 23 beta node operators across 12 countries
- **Success Rate**: 98.7% successful dispute resolution
- **User Feedback**: 4.6/5 average user satisfaction score

---

## v0.1.0 - Alpha Release
*Released: October 1, 2024*

### 🧪 Alpha Features
- **Internal Testing**: Limited functionality for core team testing
- **Basic Contracts**: Initial smart contract implementations
- **Proof of Concept**: Demonstrated AI-blockchain integration feasibility
- **Architecture Validation**: Confirmed technical approach viability

### 🔬 Research & Development
- **AI Model Testing**: Evaluated different AI models for arbitration tasks
- **Consensus Mechanisms**: Tested various voting and consensus algorithms
- **Performance Benchmarking**: Established baseline performance metrics
- **Security Analysis**: Initial security audit and threat modeling

### 📋 Alpha Limitations
- **Limited Dispute Types**: Only simple binary disputes supported
- **Single AI Model**: Used only one AI model (GPT-4)
- **Manual Processing**: Many processes required manual intervention
- **No User Interface**: Command-line only interaction

---

## Upcoming Releases

### v0.4.0 - Enhanced AI Integration
*Planned: February 2025*

#### Planned Features
- **GPT-4 Turbo**: Integration with latest OpenAI models
- **Claude-3.5 Sonnet**: Support for Anthropic's newest model
- **Local Model Support**: Enhanced support for self-hosted AI models
- **Custom Model Training**: Beta support for domain-specific model fine-tuning

### v0.5.0 - Mobile SDK
*Planned: March 2025*

#### Planned Features
- **iOS SDK**: Native iOS integration library
- **Android SDK**: Native Android integration library
- **React Native**: React Native wrapper for cross-platform development
- **Flutter Plugin**: Flutter integration for mobile developers

### v1.0.0 - Mainnet Launch
*Planned: June 2025*

#### Planned Features
- **Base Mainnet**: Production deployment on Base L2
- **Token Launch**: Verdikta Token (VDK) generation event
- **Governance System**: On-chain governance for protocol parameters
- **Staking Rewards**: Live staking and reward distribution
- **Enterprise Features**: Advanced features for business users

---

## Release Schedule

| Quarter | Focus | Major Features |
|---------|-------|----------------|
| Q1 2025 | Developer Experience | Enhanced APIs, SDKs, tooling |
| Q2 2025 | Mainnet Launch | Production deployment, token launch |
| Q3 2025 | Ecosystem Growth | Multi-chain, partnerships, scaling |
| Q4 2025 | Advanced Features | Cross-chain, specialized disputes |

## Support

For questions about specific releases:
- **Technical Issues**: [GitHub Issues](https://github.com/verdikta/verdikta-docs/issues)
- **General Questions**: [Discord Community](https://discord.gg/verdikta)
- **Security Issues**: [security@verdikta.org](mailto:security@verdikta.org)
- **Business Inquiries**: [partnerships@verdikta.org](mailto:partnerships@verdikta.org) 