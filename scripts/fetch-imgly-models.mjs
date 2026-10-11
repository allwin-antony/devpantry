import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const VERSION = '1.7.0';
const BASE_URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/dist/`;

const CWD = process.cwd();
const PRIMARY_DIR = path.resolve(CWD, 'public/models');
const LEGACY_DIR = path.resolve(CWD, 'public/assets/imgly-v1.7.0');

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Mirror / hardlink a file from src to dest with copy fallback
function mirrorFile(src, dest) {
  if (fs.existsSync(dest)) {
    const srcStat = fs.statSync(src);
    const destStat = fs.statSync(dest);
    if (srcStat.size === destStat.size) {
      return false; // Already identical
    }
    fs.unlinkSync(dest);
  }
  ensureDir(path.dirname(dest));
  try {
    fs.linkSync(src, dest);
  } catch {
    fs.copyFileSync(src, dest);
  }
  return true;
}

// Download file safely using .tmp intermediate file
async function downloadFile(url, destPath, retries = 3) {
  ensureDir(path.dirname(destPath));
  const tempPath = `${destPath}.tmp_${Date.now()}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
          }
          const fileStream = fs.createWriteStream(tempPath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
          fileStream.on('error', (err) => {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            reject(err);
          });
        });
        req.on('error', (err) => {
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          reject(err);
        });
        req.setTimeout(30000, () => {
          req.destroy(new Error(`Timeout downloading ${url}`));
        });
      });

      fs.renameSync(tempPath, destPath);
      return;
    } catch (err) {
      if (fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch {}
      }
      if (attempt === retries) {
        throw new Error(`Failed to download ${url} after ${retries} attempts: ${err.message}`);
      }
      console.warn(`[imgly] Retry ${attempt}/${retries} for ${url} (${err.message})`);
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

// Assemble raw ONNX model from chunks
async function assembleRawModel(chunks, destPath, chunksDir, expectedSize) {
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    if (stat.size === expectedSize) {
      return false; // Already assembled and matches expected size
    }
    fs.unlinkSync(destPath);
  }

  ensureDir(path.dirname(destPath));
  const tempPath = `${destPath}.tmp_${Date.now()}`;
  const writeStream = fs.createWriteStream(tempPath);

  for (const chunk of chunks) {
    const chunkFile = path.join(chunksDir, chunk.name || chunk.hash);
    if (!fs.existsSync(chunkFile)) {
      writeStream.destroy();
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      throw new Error(`Missing chunk file ${chunkFile} required to assemble ${destPath}`);
    }
    const data = fs.readFileSync(chunkFile);
    if (!writeStream.write(data)) {
      await new Promise((resolve) => writeStream.once('drain', resolve));
    }
  }

  await new Promise((resolve, reject) => {
    writeStream.end();
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  const finalStat = fs.statSync(tempPath);
  if (finalStat.size !== expectedSize) {
    fs.unlinkSync(tempPath);
    throw new Error(`Assembled ${destPath} size ${finalStat.size} does not match expected size ${expectedSize}`);
  }

  fs.renameSync(tempPath, destPath);
  return true;
}

export async function provisionModels(options = {}) {
  const shouldAssemble = options.assemble ?? true;
  console.log(`[imgly] Initializing offline model asset provisioning for v${VERSION}...`);
  ensureDir(PRIMARY_DIR);
  ensureDir(LEGACY_DIR);

  // 1. Resolve resources.json
  const primaryResourcesPath = path.join(PRIMARY_DIR, 'resources.json');
  const legacyResourcesPath = path.join(LEGACY_DIR, 'resources.json');

  if (!fs.existsSync(primaryResourcesPath)) {
    if (fs.existsSync(legacyResourcesPath)) {
      console.log(`[imgly] Reusing existing resources.json from legacy directory...`);
      mirrorFile(legacyResourcesPath, primaryResourcesPath);
    } else {
      console.log(`[imgly] Fetching resources.json from upstream CDN...`);
      await downloadFile(`${BASE_URL}resources.json`, primaryResourcesPath);
      mirrorFile(primaryResourcesPath, legacyResourcesPath);
    }
  } else if (!fs.existsSync(legacyResourcesPath)) {
    mirrorFile(primaryResourcesPath, legacyResourcesPath);
  }

  const resourcesData = JSON.parse(fs.readFileSync(primaryResourcesPath, 'utf8'));

  // 2. Collect all chunk descriptors across all resources (WASM + ISNet models)
  const chunkMap = new Map(); // chunkName -> expectedSize
  for (const [, resource] of Object.entries(resourcesData)) {
    if (Array.isArray(resource.chunks)) {
      for (const chunk of resource.chunks) {
        const chunkName = chunk.name || chunk.hash;
        const expectedSize = chunk.offsets[1] - chunk.offsets[0];
        chunkMap.set(chunkName, expectedSize);
      }
    }
  }

  console.log(`[imgly] Validating ${chunkMap.size} chunk files for 100% offline inference...`);

  let downloadedCount = 0;
  let mirroredPrimaryCount = 0;
  let mirroredLegacyCount = 0;
  let validPrimaryCount = 0;

  for (const [chunkName, expectedSize] of chunkMap.entries()) {
    const primaryChunk = path.join(PRIMARY_DIR, chunkName);
    const legacyChunk = path.join(LEGACY_DIR, chunkName);

    let primaryValid = fs.existsSync(primaryChunk) && fs.statSync(primaryChunk).size === expectedSize;
    let legacyValid = fs.existsSync(legacyChunk) && fs.statSync(legacyChunk).size === expectedSize;

    // Check if we can mirror from legacy to primary
    if (!primaryValid && legacyValid) {
      mirrorFile(legacyChunk, primaryChunk);
      primaryValid = true;
      mirroredPrimaryCount++;
    }

    // Check if we can mirror from primary to legacy
    if (primaryValid && !legacyValid) {
      mirrorFile(primaryChunk, legacyChunk);
      legacyValid = true;
      mirroredLegacyCount++;
    }

    // If missing in both, download to primary then mirror to legacy
    if (!primaryValid) {
      console.log(`[imgly] Downloading missing chunk: ${chunkName} (${expectedSize} bytes)...`);
      await downloadFile(`${BASE_URL}${chunkName}`, primaryChunk);
      mirrorFile(primaryChunk, legacyChunk);
      downloadedCount++;
    }

    validPrimaryCount++;
  }

  console.log(`[imgly] Chunks check complete: ${validPrimaryCount} verified (${downloadedCount} downloaded, ${mirroredPrimaryCount} mirrored to public/models/, ${mirroredLegacyCount} mirrored to legacy).`);

  // 3. Assemble raw ONNX models (isnet.onnx, isnet_fp16.onnx, isnet_quint8.onnx)
  if (shouldAssemble) {
    console.log(`[imgly] Assembling raw ISNet ONNX model files in public/models/...`);
    let assembledCount = 0;
    for (const [key, resource] of Object.entries(resourcesData)) {
      if (key.startsWith('/models/')) {
        const modelName = key.replace('/models/', ''); // 'isnet_fp16', 'isnet', 'isnet_quint8'
        const destOnnx = path.join(PRIMARY_DIR, `${modelName}.onnx`);
        const didAssemble = await assembleRawModel(resource.chunks, destOnnx, PRIMARY_DIR, resource.size);
        if (didAssemble) {
          assembledCount++;
          console.log(`[imgly] Assembled ${modelName}.onnx (${resource.size} bytes).`);
        }
      }
    }
    if (assembledCount === 0) {
      console.log(`[imgly] All raw ONNX model files are up to date.`);
    }
  }

  console.log(`[imgly] Offline model provisioning complete! Both public/models/ and public/assets/imgly-v1.7.0/ are consistent.`);
}

// Execute CLI
const isDirectRun = !process.env.IMGLY_NO_AUTO_RUN && (
  !process.argv[1] ||
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url)) ||
  process.argv[1].endsWith('fetch-imgly-models.mjs')
);

if (isDirectRun) {
  const noAssemble = process.argv.includes('--no-assemble');
  provisionModels({ assemble: !noAssemble }).catch((err) => {
    console.error(`[imgly] FATAL ERROR during model provisioning:`, err);
    process.exit(1);
  });
}
