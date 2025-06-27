# Developer Documentation Guide

Quick reference for adding and maintaining documentation in the Verdikta ecosystem.

## 📝 Adding Smart Contract Documentation

### NatSpec Format
Use standard NatSpec comments for automatic API generation:

```solidity
/**
 * @title ContractName
 * @author Verdikta Team  
 * @notice Brief description for end users
 * @dev Technical implementation details
 */
contract MyContract {
    
    /**
     * @notice What this function does for users
     * @dev Technical implementation notes
     * @param user Address of the user
     * @param amount Token amount in wei
     * @return success Whether operation succeeded
     */
    function myFunction(address user, uint256 amount) 
        external returns (bool success) {
        // implementation
    }
    
    /// @notice Brief event description
    event MyEvent(address indexed user, uint256 amount);
}
```

### Core Contracts (Auto-Generated)
These contracts are automatically processed for API documentation:

- `ReputationAggregator.sol` - Main aggregation logic
- `ReputationKeeper.sol` - Oracle registration & reputation  
- `ReputationSingleton.sol` - Single oracle interface
- `ArbiterOperator.sol` - Chainlink operator with access control
- `SimpleContract.sol` - Basic testing contract
- `IReputationKeeper.sol` - Interface definitions

## 🔄 Documentation Workflow

### Automatic Generation
1. **Trigger**: Push to `main` branch or every 6 hours
2. **Process**: GitHub Actions extracts NatSpec from core contracts
3. **Output**: Auto-generated API docs at `/dispatcher/contracts/api/generated/`
4. **Deploy**: Automatically published to [docs.verdikta.com](https://docs.verdikta.com)

### Manual Documentation
- Place additional docs in respective `docs/` directories
- Use standard Markdown with MkDocs Material features
- Link to auto-generated APIs using relative paths

## 🧪 Testing Documentation Locally

### Prerequisites
```bash
pip install -r requirements.txt
```

### Test NatSpec Generation
```bash
# Generate API docs locally
node scripts/generate-natspec-docs.js \
  sources/dispatcher \
  sources/dispatcher/docs/api/generated/index.md \
  "Verdikta Dispatcher Smart Contracts"
```

### Test Full Site
```bash
# Serve documentation locally  
mkdocs serve

# Check for broken links
mkdocs build --strict
```

## 📋 Documentation Standards

### Contract Documentation
- **Always include**: `@title`, `@author`, `@notice`
- **For complex functions**: Add `@dev` with implementation details
- **Document all parameters**: Use `@param` for each parameter
- **Document returns**: Use `@return` for return values
- **Events**: Use `/// @notice` for event descriptions

### Quality Guidelines
- **Notice**: User-facing description, avoid technical jargon
- **Dev**: Technical details for developers/auditors
- **Parameters**: Describe what each parameter represents
- **Examples**: Include usage examples for complex functions

### What Gets Excluded
- Chainlink library contracts (`lib/` directories)
- Test files (`.t.sol` extension)
- Mock contracts and examples
- Dependencies and vendor code

## 🔧 Troubleshooting

### Documentation Not Appearing
1. Check contract is in core contracts list
2. Verify NatSpec format is correct
3. Ensure contract compiles without errors
4. Check GitHub Actions logs for build errors

### Broken Links
- Use relative paths for internal links
- Test locally with `mkdocs serve`
- Run `mkdocs build --strict` to catch issues

### Adding New Core Contracts
Edit `scripts/generate-natspec-docs.js` and add to `coreContracts` array:

```javascript
const coreContracts = [
  'ReputationAggregator.sol',
  'ReputationKeeper.sol', 
  // ... existing contracts
  'YourNewContract.sol'  // Add here
];
```

## 🚀 Best Practices

### For Contract Developers
- Document functions **before** implementation
- Keep `@notice` user-focused, `@dev` technical
- Update docs when changing function signatures
- Test documentation generation locally

### For Documentation Contributors  
- Use consistent formatting and style
- Include code examples where helpful
- Link between related documentation sections
- Keep explanations concise but complete

---

**Next Steps**: After adding documentation, push to `main` and check [docs.verdikta.com](https://docs.verdikta.com) for automatic updates. 