import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load environment variables from .env and .env.local
if (fs.existsSync(path.join(rootDir, ".env"))) {
  dotenv.config({ path: path.join(rootDir, ".env"), quiet: true });
}
if (fs.existsSync(path.join(rootDir, ".env.local"))) {
  dotenv.config({ path: path.join(rootDir, ".env.local"), override: true, quiet: true });
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error(
    "Missing Cloudinary credentials. Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your local environment.",
  );
  process.exit(1);
}

function safeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return [apiKey, apiSecret].reduce(
    (safeMessage, credential) => safeMessage.replaceAll(credential, "[redacted]"),
    message,
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function uploadImages() {
  console.log("\n🚀 Starting upload to Cloudinary...\n");

  const assetsDir = path.join(rootDir, "src", "assets");
  const assetFiles = fs
    .readdirSync(assetsDir)
    .filter((file) => /\.(jpe?g|png|webp|svg)$/i.test(file));
  const requestedKeys = process.argv.slice(2);
  const availableKeys = new Set(assetFiles.map((file) => path.parse(file).name));
  const unknownKeys = requestedKeys.filter((key) => !availableKeys.has(key));

  if (unknownKeys.length > 0) {
    throw new Error(`Unknown asset key(s): ${unknownKeys.join(", ")}`);
  }

  const selectedFiles =
    requestedKeys.length > 0
      ? assetFiles.filter((file) => requestedKeys.includes(path.parse(file).name))
      : assetFiles;
  const uploads = selectedFiles.map((file) => {
    const manifestKey = path.parse(file).name;
    return {
      filePath: path.join(assetsDir, file),
      manifestKey,
      publicId: `ahab-clothing/products/${manifestKey}`,
    };
  });

  if (requestedKeys.length === 0) {
    const ogPath = path.join(rootDir, "public", "og-image.jpg");
    if (fs.existsSync(ogPath)) {
      uploads.push({
        filePath: ogPath,
        manifestKey: "og-image",
        publicId: "ahab-clothing/brand/og-image",
      });
    }
  }

  const manifestPath = path.join(rootDir, "src", "data", "cloudinary-manifest.json");
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
    : {};

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("Cloudinary manifest must contain a JSON object.");
  }

  let hasFailures = false;

  for (const upload of uploads) {
    console.log(`Uploading ${path.basename(upload.filePath)} -> ${upload.publicId}...`);

    try {
      const res = await cloudinary.uploader.upload(upload.filePath, {
        public_id: upload.publicId,
        overwrite: true,
        resource_type: "image",
      });

      manifest[upload.manifestKey] = {
        publicId: res.public_id,
        secureUrl: res.secure_url,
        url: res.secure_url,
        width: res.width,
        height: res.height,
        format: res.format,
        bytes: res.bytes,
        createdAt: res.created_at,
        // Optimized URL using auto format and auto quality
        optimizedUrl: cloudinary.url(res.public_id, {
          fetch_format: "auto",
          quality: "auto",
          secure: true,
        }),
      };

      console.log(`✅ Uploaded ${upload.manifestKey}`);
    } catch (err) {
      hasFailures = true;
      console.error(`❌ Failed to upload ${upload.manifestKey}: ${safeErrorMessage(err)}`);
    }
  }

  const outDir = path.dirname(manifestPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\nManifest merged and saved to: ${manifestPath}`);
  console.log(`Total manifest entries: ${Object.keys(manifest).length}`);

  if (hasFailures) {
    process.exitCode = 1;
  }
}

uploadImages().catch((err) => {
  console.error("Fatal error during upload:", safeErrorMessage(err));
  process.exit(1);
});
