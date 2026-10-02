import fs from 'fs/promises';
import path from 'path';

const SOURCES: Array<{ name: string; url: string; format: string }> = [
  {
    name: 'public-apis/public-apis',
    url: 'https://raw.githubusercontent.com/public-apis/public-apis/master/README.md',
    format: 'standard'
  },
  {
    name: 'public-api-lists/public-api-lists',
    url: 'https://raw.githubusercontent.com/public-api-lists/public-api-lists/master/README.md',
    format: 'standard'
  },
  {
    name: 'marcelscruz/public-apis',
    url: 'https://raw.githubusercontent.com/marcelscruz/public-apis/main/README.md',
    format: 'marcel'
  }
];

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'public-apis.json');

export interface PublicApiEntry {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  CORS: string;
  Link: string;
  Category: string;
}

async function syncPublicApis() {
  const allEntries = new Map<string, PublicApiEntry>(); // Use Map for deduplication by Link URL

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
      let isParsingTable = false;
      let addedFromSource = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect category headings (### Category Name)
        if (line.startsWith('### ')) {
          currentCategory = line.replace('### ', '').trim();
          isParsingTable = false;
          continue;
        }

        if (source.format === 'standard') {
          // Detect table headers for standard format
          if (line.includes('API') && line.includes('Description') && line.includes('Auth') && line.includes('HTTPS')) {
            isParsingTable = true;
            continue; // Header row
          }

          if (isParsingTable && line.startsWith('|') && !line.startsWith('|---') && !line.startsWith('|:---')) {
            const cols = line.split('|').map(col => col.trim()).filter(Boolean);
            if (cols.length >= 5) {
              const apiCol = cols[0];
              const linkMatch = apiCol.match(/\[(.*?)\]\((.*?)\)/);

              if (linkMatch) {
                const name = linkMatch[1].replace(/\*\*/g, '');
                const link = linkMatch[2];

                if (!allEntries.has(link)) {
                  allEntries.set(link, {
                    API: name,
                    Description: cols[1],
                    Auth: cols[2] === 'No' ? '' : cols[2],
                    HTTPS: cols[3].toLowerCase() === 'yes',
                    CORS: cols[4],
                    Link: link,
                    Category: currentCategory
                  });
                  addedFromSource++;
                }
              }
            }
          }
        } else if (source.format === 'marcel') {
          // Detect table headers for marcel format
          if (line.includes('API') && line.includes('Description') && line.includes('Auth') && line.includes('CORS') && !line.includes('HTTPS')) {
            isParsingTable = true;
            continue; // Header row
          }

          if (isParsingTable && line.startsWith('|') && !line.startsWith('|---') && !line.startsWith('|:---')) {
            const cols = line.split('|').map(col => col.trim()).filter(Boolean);
            if (cols.length >= 4) {
              const apiCol = cols[0];
              const linkMatch = apiCol.match(/\[(.*?)\]\((.*?)\)/);

              if (linkMatch) {
                const name = linkMatch[1].replace(/\*\*/g, '');
                const link = linkMatch[2];

                if (!allEntries.has(link)) {
                  allEntries.set(link, {
                    API: name,
                    Description: cols[1],
                    Auth: cols[2] === 'No' ? '' : cols[2],
                    HTTPS: true, // Marcel format doesn't have HTTPS, assume true
                    CORS: cols[3],
                    Link: link,
                    Category: currentCategory
                  });
                  addedFromSource++;
                }
              }
            }
          }
        }


        // Stop parsing table if we hit an empty line or something that's not a table row
        if (isParsingTable && !line.startsWith('|') && line !== '') {
          isParsingTable = false;
        }
      }

      console.log(`Parsed ${addedFromSource} unique APIs from ${source.name}.`);
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
  console.log(`\nTotal unique APIs aggregated: ${finalEntries.length}`);

  // Ensure the data directory exists
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

  // Write the output JSON
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(finalEntries, null, 2), 'utf-8');

  console.log(`✅ Data synced and saved to ${OUTPUT_PATH}`);
}

syncPublicApis();
