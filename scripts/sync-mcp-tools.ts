import fs from 'fs/promises';
import path from 'path';

const SOURCES: Array<{ name: string; url: string; format: string }> = [
  {
    name: 'punkpeye/awesome-mcp-servers',
    url: 'https://raw.githubusercontent.com/punkpeye/awesome-mcp-servers/main/README.md',
    format: 'punkpeye'
  },
  {
    name: 'wong2/awesome-mcp-servers',
    url: 'https://raw.githubusercontent.com/wong2/awesome-mcp-servers/main/README.md',
    format: 'wong2'
  },
  {
    name: 'habitoai/awesome-mcp-servers',
    url: 'https://raw.githubusercontent.com/habitoai/awesome-mcp-servers/main/README.md',
    format: 'habitoai'
  },
  {
    name: 'modelcontextprotocol/servers',
    url: 'https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md',
    format: 'mcp-official'
  }
];

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'mcp-tools.json');

export interface McpToolEntry {
  API: string;
  Description: string;
  Language: string;
  Link: string;
  Category: string;
}

async function syncMcpTools() {
  const allEntries = new Map<string, McpToolEntry>(); // Use Map for deduplication by Link URL

  for (const source of SOURCES) {
    console.log(`\nFetching from ${source.name}...`);
    try {
      const response = await fetch(source.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const markdown = await response.text();
      const lines = markdown.split('\n');

      let currentCategory = 'Uncategorized';
      let addedFromSource = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect category headings (### Category Name or ## Category Name)
        if (line.startsWith('### ')) {
          currentCategory = line.replace('### ', '').replace(/<[^>]+>/g, '').replace(/[^\x00-\x7F]/g, "").trim();
          continue;
        } else if (line.startsWith('## ') && !['What is MCP?', 'Clients', 'Remote Servers', 'Tutorials', 'Community', 'Legend', 'Server Implementations', 'Frameworks', 'Tips & Tricks'].includes(line.replace('## ', '').trim())) {
           // For wong2 repo which uses ## for categories
           currentCategory = line.replace('## ', '').replace(/<[^>]+>/g, '').replace(/[^\x00-\x7F]/g, "").trim();
           continue;
        }

        if (source.format === 'punkpeye') {
          // Detect bullet points: - [Name](url) [![badges]] emojis - description
          if (line.startsWith('- [')) {
            const match = line.match(/- \[(.*?)\]\((.*?)\)(?:.*?\]\(.*?\))?(.*?)- (.*)/);
            if (match) {
              let name = match[1].replace(/<[^>]+>/g, '').trim();
              const url = match[2].trim();
              if (!name) {
                name = url.split('/').filter(Boolean).pop() || 'Unknown Server';
              }
              const emojis = match[3].trim();
              let desc = match[4].trim();

              let language = 'Unknown';
              if (emojis.includes('🐍')) language = 'Python';
              else if (emojis.includes('📇')) language = 'TypeScript';
              else if (emojis.includes('🏎️')) language = 'Go';
              else if (emojis.includes('🦀')) language = 'Rust';
              else if (emojis.includes('☕')) language = 'Java';
              else if (emojis.includes('💎')) language = 'Ruby';

              if (!allEntries.has(url)) {
                allEntries.set(url, {
                  API: name,
                  Description: desc,
                  Language: language,
                  Link: url,
                  Category: currentCategory
                });
                addedFromSource++;
              }
            }
          }
        } else if (source.format === 'wong2' || source.format === 'habitoai' || source.format === 'mcp-official') {
          // Detect bullet points: - **[Name](url)** - description OR - [Name](url) - description
          if (line.startsWith('- [')) {
            const match = line.match(/- \[(.*?)\]\((.*?)\) - (.*)/);
            if (match) {
              let name = match[1].replace(/<[^>]+>/g, '').trim();
              let url = match[2].trim();
              if (!name) {
                name = url.split('/').filter(Boolean).pop() || 'Unknown Server';
              }
              if (source.format === 'mcp-official' && url.startsWith('src/')) {
                url = 'https://github.com/modelcontextprotocol/servers/tree/main/' + url;
              }
              let desc = match[3].trim();

              let language = 'Unknown';
              const runtimeMatch = desc.match(/`([^`]+)`/g);
              if (runtimeMatch) {
                const possibleLang = runtimeMatch[runtimeMatch.length - 1].replace(/`/g, '');
                const validLangs: Record<string, string> = {
                  'python': 'Python', 'typescript': 'TypeScript', 'ts': 'TypeScript',
                  'node.js': 'TypeScript', 'node': 'TypeScript', 'javascript': 'TypeScript', 'js': 'TypeScript',
                  'go': 'Go', 'rust': 'Rust', 'java': 'Java', 'ruby': 'Ruby', 'php': 'PHP',
                  'c++': 'C++', 'c#': 'C#', 'swift': 'Swift', 'kotlin': 'Kotlin'
                };
                if (validLangs[possibleLang.toLowerCase()]) {
                  language = validLangs[possibleLang.toLowerCase()];
                  desc = desc.replace(runtimeMatch[runtimeMatch.length - 1], '').trim();
                }
              }

              if (!allEntries.has(url)) {
                allEntries.set(url, {
                  API: name,
                  Description: desc,
                  Language: language,
                  Link: url,
                  Category: source.format === 'mcp-official' ? 'Reference Implementations' : currentCategory
                });
                addedFromSource++;
              }
            }
          } else if (line.startsWith('- **[')) {
            const match = line.match(/- \*\*\[(.*?)\]\((.*?)\)\*\* - (.*)/);
            if (match) {
              let name = match[1].replace(/<[^>]+>/g, '').trim();
              let url = match[2].trim();
              if (!name) {
                name = url.split('/').filter(Boolean).pop() || 'Unknown Server';
              }
              if (source.format === 'mcp-official' && url.startsWith('src/')) {
                url = 'https://github.com/modelcontextprotocol/servers/tree/main/' + url;
              }
              let desc = match[3].trim();

              let language = 'Unknown';
              const runtimeMatch = desc.match(/`([^`]+)`/g);
              if (runtimeMatch) {
                const possibleLang = runtimeMatch[runtimeMatch.length - 1].replace(/`/g, '');
                const validLangs: Record<string, string> = {
                  'python': 'Python', 'typescript': 'TypeScript', 'ts': 'TypeScript',
                  'node.js': 'TypeScript', 'node': 'TypeScript', 'javascript': 'TypeScript', 'js': 'TypeScript',
                  'go': 'Go', 'rust': 'Rust', 'java': 'Java', 'ruby': 'Ruby', 'php': 'PHP',
                  'c++': 'C++', 'c#': 'C#', 'swift': 'Swift', 'kotlin': 'Kotlin'
                };
                if (validLangs[possibleLang.toLowerCase()]) {
                  language = validLangs[possibleLang.toLowerCase()];
                  desc = desc.replace(runtimeMatch[runtimeMatch.length - 1], '').trim();
                }
              }

              if (!allEntries.has(url)) {
                allEntries.set(url, {
                  API: name,
                  Description: desc,
                  Language: language,
                  Link: url,
                  Category: source.format === 'mcp-official' ? 'Reference Implementations' : currentCategory
                });
                addedFromSource++;
              }
            }
          }
        }
      }

      console.log(`Parsed ${addedFromSource} unique servers from ${source.name}.`);
    } catch (error) {
      console.error(`Error syncing from ${source.name}:`, error);
    }
  }

  const finalEntries = Array.from(allEntries.values()).sort((a, b) => {
    // Sort primarily by Category, then alphabetically by API name
    if (a.Category < b.Category) return -1;
    if (a.Category > b.Category) return 1;
    return a.API.toLowerCase().localeCompare(b.API.toLowerCase());
  });
  console.log(`\nTotal unique servers aggregated: ${finalEntries.length}`);

  // Ensure the data directory exists
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

  // Write the output JSON
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(finalEntries, null, 2), 'utf-8');

  console.log(`✅ Data synced and saved to ${OUTPUT_PATH}`);
}

syncMcpTools();
