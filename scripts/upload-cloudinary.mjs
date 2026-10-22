import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env and .env.local
if (fs.existsSync(path.join(rootDir, '.env'))) {
  dotenv.config({ path: path.join(rootDir, '.env') });
}
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
  dotenv.config({ path: path.join(rootDir, '.env.local'), override: true });
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvyj6ac75';
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error('\n❌ Error: Missing Cloudinary API Key or API Secret.');
  console.error('Please add the following to your .env or .env.local file:');
  console.error(`CLOUDINARY_CLOUD_NAME=${cloudName}`);
  console.error('CLOUDINARY_API_KEY=your_cloudinary_api_key');
  console.error('CLOUDINARY_API_SECRET=your_cloudinary_api_secret\n');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function uploadImages() {
  console.log(`\n🚀 Starting upload to Cloudinary (Cloud: ${cloudName})...\n`);

  const assetsDir = path.join(rootDir, 'src', 'assets');
  const files = fs.readdirSync(assetsDir).filter(f => /\.(jpe?g|png|webp|svg)$/i.test(f));

  // Also include og-image from public/
  const extraImages = [];
  const ogPath = path.join(rootDir, 'public', 'og-image.jpg');
  if (fs.existsSync(ogPath)) {
    extraImages.push({
      filePath: ogPath,
      name: 'og-image',
      folder: 'ahab-clothing/brand'
    });
  }

  const manifest = {};

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const parsed = path.parse(file);
    const publicId = `ahab-clothing/products/${parsed.name}`;

    console.log(`Uploading ${file} -> ${publicId}...`);

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });

      manifest[parsed.name] = {
        publicId: res.public_id,
        secureUrl: res.secure_url,
        url: res.url,
        width: res.width,
        height: res.height,
        format: res.format,
        bytes: res.bytes,
        createdAt: res.created_at,
        // Optimized URL using auto format and auto quality
        optimizedUrl: cloudinary.url(res.public_id, {
          fetch_format: 'auto',
          quality: 'auto',
          secure: true,
        }),
      };

      console.log(`✅ Uploaded: ${res.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message || err);
    }
  }

  for (const extra of extraImages) {
    const publicId = `${extra.folder}/${extra.name}`;
    console.log(`Uploading extra asset ${extra.name} -> ${publicId}...`);
    try {
      const res = await cloudinary.uploader.upload(extra.filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });

      manifest[extra.name] = {
        publicId: res.public_id,
        secureUrl: res.secure_url,
        url: res.url,
        width: res.width,
        height: res.height,
        format: res.format,
        bytes: res.bytes,
        createdAt: res.created_at,
        optimizedUrl: cloudinary.url(res.public_id, {
          fetch_format: 'auto',
          quality: 'auto',
          secure: true,
        }),
      };
      console.log(`✅ Uploaded: ${res.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${extra.name}:`, err.message || err);
    }
  }

  const outDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const manifestPath = path.join(outDir, 'cloudinary-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n🎉 Success! Manifest saved to: ${manifestPath}`);
  console.log(`Total images uploaded: ${Object.keys(manifest).length}`);
}

uploadImages().catch(err => {
  console.error('Fatal error during upload:', err);
  process.exit(1);
});
