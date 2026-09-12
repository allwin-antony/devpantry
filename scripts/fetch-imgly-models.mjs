import fs from 'fs';
import path from 'path';
import https from 'https';

const VERSION = '1.7.0';
const BASE_URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/dist/`;
const DEST_DIR = path.resolve(process.cwd(), 'public/assets/imgly-v1.7.0');

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
      
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function fetchModels() {
  console.log(`[imgly] Fetching resources.json for v${VERSION}...`);
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  const resourcesUrl = `${BASE_URL}resources.json`;
  const resourcesDest = path.join(DEST_DIR, 'resources.json');
  
  await downloadFile(resourcesUrl, resourcesDest);
  
  const resourcesData = JSON.parse(fs.readFileSync(resourcesDest, 'utf8'));
  console.log(`[imgly] Parsed resources.json. Downloading chunks...`);
  
  const chunksToDownload = new Set();
  
  // Download WASM logic and isnet_fp16 model (the one the library is failing to find)
  for (const [key, resource] of Object.entries(resourcesData)) {
    if (key.includes('wasm') || key.includes('isnet_fp16') || key.includes('isnet')) {
      for (const chunk of resource.chunks) {
        chunksToDownload.add(chunk.name || chunk.hash);
      }
    }
  }

  const chunks = Array.from(chunksToDownload);
  console.log(`[imgly] Total chunks to download: ${chunks.length}`);
  
  // Download sequentially
  for (let i = 0; i < chunks.length; i++) {
    const chunkName = chunks[i];
    const chunkUrl = `${BASE_URL}${chunkName}`;
    const chunkDest = path.join(DEST_DIR, chunkName);
    
    if (!fs.existsSync(chunkDest)) {
      console.log(`[imgly] Downloading chunk ${i + 1}/${chunks.length}: ${chunkName}...`);
      await downloadFile(chunkUrl, chunkDest);
    } else {
      console.log(`[imgly] Chunk ${chunkName} already exists, skipping.`);
    }
  }
  
  console.log(`[imgly] All required models fetched successfully to public/assets/imgly/`);
}

fetchModels().catch(console.error);
