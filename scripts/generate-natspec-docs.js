#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Extract NatSpec documentation from Solidity files
 */
class NatSpecExtractor {
  constructor() {
    this.contracts = [];
  }

  /**
   * Process a single Solidity file and extract NatSpec documentation
   */
  processSolidityFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.sol');
      
      console.log(`Processing: ${fileName}.sol`);
      
      // Extract contract-level documentation
      const contractDoc = this.extractContractDocumentation(content, fileName);
      
      if (contractDoc) {
        // Extract functions, events, and structs
        contractDoc.functions = this.extractFunctions(content);
        contractDoc.events = this.extractEvents(content);
        contractDoc.structs = this.extractStructs(content);
        
        this.contracts.push(contractDoc);
        return contractDoc;
      }
      
      return null;
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Extract contract-level NatSpec documentation
   */
  extractContractDocumentation(content, fileName) {
    // Match contract block with preceding comment
    const contractRegex = /\/\*\*[\s\S]*?\*\/\s*contract\s+(\w+)/g;
    const match = contractRegex.exec(content);
    
    if (!match) {
      console.warn(`No documented contract found in ${fileName}`);
      return null;
    }
    
    const contractName = match[1];
    const commentBlock = match[0];
    
    return {
      name: contractName,
      fileName: fileName,
      title: this.extractTag(commentBlock, 'title'),
      author: this.extractTag(commentBlock, 'author'),
      notice: this.extractTag(commentBlock, 'notice'),
      dev: this.extractTag(commentBlock, 'dev')
    };
  }

  /**
   * Extract function documentation
   */
  extractFunctions(content) {
    const functions = [];
    
    // Match function blocks with preceding NatSpec comments
    const functionRegex = /\/\*\*[\s\S]*?\*\/\s*function\s+(\w+)\s*\([^)]*\)\s*[^{]*(?:external|public)[^{]*(?:\{|;)/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const funcName = match[1];
      const fullMatch = match[0];
      
      // Extract function signature
      const sigMatch = fullMatch.match(/function\s+\w+\s*\([^)]*\)[^{]*(?:external|public)[^{]*/);
      const signature = sigMatch ? sigMatch[0].trim() : '';
      
      const funcDoc = {
        name: funcName,
        signature: signature,
        notice: this.extractTag(fullMatch, 'notice'),
        dev: this.extractTag(fullMatch, 'dev'),
        params: this.extractParams(fullMatch),
        returns: this.extractReturns(fullMatch)
      };
      
      functions.push(funcDoc);
    }
    
    return functions;
  }

  /**
   * Extract event documentation
   */
  extractEvents(content) {
    const events = [];
    
    // Match events with preceding NatSpec comments (using /// style)
    const eventRegex = /\/\/\/[^\n]*@notice[^\n]*\n(?:[^\n]*\n)*?\s*event\s+(\w+)/g;
    let match;
    
    while ((match = eventRegex.exec(content)) !== null) {
      const eventName = match[1];
      const precedingLines = match[0];
      
      // Extract notice from /// comment
      const noticeMatch = precedingLines.match(/\/\/\/[^@]*@notice\s+([^\n]+)/);
      const notice = noticeMatch ? noticeMatch[1].trim() : '';
      
      events.push({
        name: eventName,
        notice: notice
      });
    }
    
    return events;
  }

  /**
   * Extract struct documentation
   */
  extractStructs(content) {
    const structs = [];
    
    // Match structs with preceding NatSpec comments
    const structRegex = /\/\*\*[\s\S]*?\*\/\s*struct\s+(\w+)/g;
    let match;
    
    while ((match = structRegex.exec(content)) !== null) {
      const structName = match[1];
      const commentBlock = match[0];
      
      structs.push({
        name: structName,
        notice: this.extractTag(commentBlock, 'notice'),
        dev: this.extractTag(commentBlock, 'dev')
      });
    }
    
    return structs;
  }

  /**
   * Extract a specific NatSpec tag
   */
  extractTag(text, tag) {
    const regex = new RegExp(`@${tag}\\s+([^@*]+)`, 'i');
    const match = text.match(regex);
    if (match) {
      return match[1].trim().replace(/\s+/g, ' ').replace(/\*\//g, '');
    }
    return '';
  }

  /**
   * Extract parameter documentation
   */
  extractParams(text) {
    const params = [];
    const paramRegex = /@param\s+(\w+)\s+([^@*]+)/g;
    let match;
    
    while ((match = paramRegex.exec(text)) !== null) {
      params.push({
        name: match[1],
        description: match[2].trim().replace(/\s+/g, ' ')
      });
    }
    
    return params;
  }

  /**
   * Extract return value documentation
   */
  extractReturns(text) {
    const returns = [];
    const returnRegex = /@return\s+(\w+)?\s*([^@*]+)/g;
    let match;
    
    while ((match = returnRegex.exec(text)) !== null) {
      returns.push({
        name: match[1] || '',
        description: match[2].trim().replace(/\s+/g, ' ')
      });
    }
    
    return returns;
  }

  /**
   * Generate markdown documentation
   */
  generateMarkdown(title = 'Smart Contract API Documentation') {
    let markdown = `# ${title}\n\n`;
    markdown += 'This documentation is auto-generated from NatSpec comments in the smart contract source code.\n\n';
    
    if (this.contracts.length === 0) {
      markdown += 'No documented contracts found.\n';
      return markdown;
    }
    
    markdown += '## Available Contracts\n\n';
    
    for (const contract of this.contracts) {
      markdown += `### ${contract.name}\n\n`;
      
      if (contract.title) {
        markdown += `**${contract.title}**\n\n`;
      }
      
      if (contract.author) {
        markdown += `**Author:** ${contract.author}\n\n`;
      }
      
      if (contract.notice) {
        markdown += `${contract.notice}\n\n`;
      }
      
      if (contract.dev) {
        markdown += `*Technical Details:* ${contract.dev}\n\n`;
      }
      
      // Document functions
      if (contract.functions.length > 0) {
        markdown += '#### Public Functions\n\n';
        
        for (const func of contract.functions) {
          markdown += `##### ${func.name}()\n\n`;
          
          if (func.notice) {
            markdown += `${func.notice}\n\n`;
          }
          
          if (func.dev) {
            markdown += `*Technical:* ${func.dev}\n\n`;
          }
          
          if (func.signature) {
            markdown += '```solidity\n';
            markdown += `${func.signature}\n`;
            markdown += '```\n\n';
          }
          
          // Document parameters
          if (func.params.length > 0) {
            markdown += '**Parameters:**\n\n';
            for (const param of func.params) {
              markdown += `- \`${param.name}\`: ${param.description}\n`;
            }
            markdown += '\n';
          }
          
          // Document return values
          if (func.returns.length > 0) {
            markdown += '**Returns:**\n\n';
            for (const ret of func.returns) {
              const name = ret.name ? `\`${ret.name}\` ` : '';
              markdown += `- ${name}${ret.description}\n`;
            }
            markdown += '\n';
          }
        }
      }
      
      // Document events
      if (contract.events.length > 0) {
        markdown += '#### Events\n\n';
        for (const event of contract.events) {
          markdown += `##### ${event.name}\n\n`;
          if (event.notice) {
            markdown += `${event.notice}\n\n`;
          }
        }
      }
      
      // Document structs
      if (contract.structs.length > 0) {
        markdown += '#### Data Structures\n\n';
        for (const struct of contract.structs) {
          markdown += `##### ${struct.name}\n\n`;
          if (struct.notice) {
            markdown += `${struct.notice}\n\n`;
          }
          if (struct.dev) {
            markdown += `*Technical:* ${struct.dev}\n\n`;
          }
        }
      }
      
      markdown += '---\n\n';
    }
    
    // Add footer
    markdown += '## Integration\n\n';
    markdown += 'All contracts implement comprehensive NatSpec documentation. For detailed integration examples and usage patterns, see the individual contract documentation pages.\n\n';
    markdown += '### Network Information\n\n';
    markdown += '- **Network:** Base Sepolia (Testnet)\n';
    markdown += '- **Documentation:** Generated from source code NatSpec comments\n';
    markdown += `- **Last Updated:** ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC\n\n`;
    markdown += '### Links\n\n';
    markdown += '- [Contract Source Code](https://github.com/verdikta/verdikta-dispatcher)\n';
    markdown += '- [Integration Examples](../examples/index.md)\n';
    markdown += '- [Manual Documentation](../index.md)\n\n';
    
    return markdown;
  }

  /**
   * Process all Solidity files in a directory
   */
  processDirectory(dirPath) {
    console.log(`Processing directory: ${dirPath}`);
    
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory not found: ${dirPath}`);
      return;
    }
    
    const files = this.findSolidityFiles(dirPath);
    console.log(`Found ${files.length} Solidity files`);
    
    for (const file of files) {
      this.processSolidityFile(file);
    }
  }

  /**
   * Recursively find only core Verdikta Solidity files (exclude dependencies)
   */
  findSolidityFiles(dirPath) {
    const files = [];
    
    // List of core Verdikta contracts we want to document
    const coreContracts = [
      'ReputationAggregator.sol',
      'ReputationKeeper.sol', 
      'ReputationSingleton.sol',
      'SimpleContract.sol',
      'ArbiterOperator.sol',
      'IReputationKeeper.sol'
    ];
    
    function traverse(currentPath) {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        // Skip lib directories (Chainlink dependencies), node_modules, .git, and test directories
        if (stat.isDirectory() && 
            !item.includes('node_modules') && 
            !item.includes('.git') &&
            !item.includes('lib') &&
            !item.includes('test')) {
          traverse(fullPath);
        } else if (stat.isFile() && 
                   item.endsWith('.sol') && 
                   !item.endsWith('.t.sol') && // Skip test files
                   coreContracts.includes(item)) {
          files.push(fullPath);
        }
      }
    }
    
    traverse(dirPath);
    return files;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node generate-natspec-docs.js <source_dir> <output_file> <title>');
    process.exit(1);
  }
  
  const [sourceDir, outputFile, title] = args;
  
  console.log('🔄 Generating NatSpec Documentation...');
  console.log(`Source: ${sourceDir}`);
  console.log(`Output: ${outputFile}`);
  console.log(`Title: ${title}`);
  
  const extractor = new NatSpecExtractor();
  extractor.processDirectory(sourceDir);
  
  const markdown = extractor.generateMarkdown(title);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, markdown);
  
  console.log('✅ Documentation generated successfully!');
  console.log(`📄 Generated: ${outputFile}`);
  console.log(`📊 Processed ${extractor.contracts.length} contracts`);
}

if (require.main === module) {
  main();
}

module.exports = NatSpecExtractor; 