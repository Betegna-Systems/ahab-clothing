import manifest from "@/data/cloudinary-manifest.json";

export const CLOUDINARY_CLOUD_NAME =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_CLOUDINARY_CLOUD_NAME"]) || "dvyj6ac75";

export interface CloudinaryAsset {
  publicId: string;
  secureUrl: string;
  url: string;
  optimizedUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  aspectRatio: number;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "fit" | "thumb" | "scale" | "crop";
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  gravity?: "auto" | "face" | "center" | "north" | "south";
  dpr?: number | string;
}

/**
 * Builds an optimized Cloudinary delivery URL with custom transformations.
 */
export function buildCloudinaryUrl(
  publicIdOrKey: string,
  options: CloudinaryTransformOptions = {}
): string {
  // If a manifest key (e.g. "top-square-neck") is passed, look up its full publicId
  const found = (manifest as Record<string, CloudinaryAsset>)[publicIdOrKey];
  const publicId = found ? found.publicId : (publicIdOrKey.startsWith("ahab-clothing/") ? publicIdOrKey : `ahab-clothing/products/${publicIdOrKey}`);

  const transforms: string[] = [];

  // Default to automatic format and quality for high performance
  transforms.push(`f_${options.format || "auto"}`);
  transforms.push(`q_${options.quality || "auto"}`);

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.dpr) transforms.push(`dpr_${options.dpr}`);

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms.join(",")}/${publicId}`;
}

/**
 * Get full metadata and details for a Cloudinary image asset.
 */
export function getCloudinaryAsset(key: keyof typeof manifest | string): CloudinaryAsset {
  const asset = (manifest as Record<string, CloudinaryAsset>)[key];
  if (asset) return asset;

  // Fallback if not found in manifest
  const cleanKey = key.replace(/\.jpg$/, "").replace(/^ahab-clothing\/products\//, "");
  const publicId = `ahab-clothing/products/${cleanKey}`;
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

  return {
    publicId,
    secureUrl: `${baseUrl}${publicId}.jpg`,
    url: `http://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.jpg`,
    optimizedUrl: `${baseUrl}f_auto,q_auto/${publicId}`,
    width: 1200,
    height: 1600,
    format: "jpg",
    bytes: 0,
    aspectRatio: 0.75,
  };
}

/**
 * All storefront images mapped to their Cloudinary optimized URLs and details.
 */
export const cloudinaryAssets = {
  // Brand & Editorial
  craftStudio: getCloudinaryAsset("craft-studio"),
  founderPortrait: getCloudinaryAsset("founder-portrait"),
  heroCampaign: getCloudinaryAsset("hero-campaign-tops"),
  ogImage: getCloudinaryAsset("og-image"),

  // Square Neck Tops
  topSquareNeck: getCloudinaryAsset("top-square-neck"),
  topSquareNeckCrimson: getCloudinaryAsset("top-square-neck-crimson"),
  topSquareNeckIvory: getCloudinaryAsset("top-square-neck-ivory"),

  // One Shoulder Tops
  topOneShoulder: getCloudinaryAsset("top-one-shoulder"),
  topOneShoulderBlack: getCloudinaryAsset("top-one-shoulder-black"),
  topOneShoulderBurgundy: getCloudinaryAsset("top-one-shoulder-burgundy"),

  // Cowl Knit Tops
  topCowl: getCloudinaryAsset("top-cowl"),
  topCowlSand: getCloudinaryAsset("top-cowl-sand"),
  topCowlBlack: getCloudinaryAsset("top-cowl-black"),

  // Corset Tops
  topCorset: getCloudinaryAsset("top-corset"),
  topCorsetIvory: getCloudinaryAsset("top-corset-ivory"),
  topCorsetBurgundy: getCloudinaryAsset("top-corset-burgundy"),

  // Cutout Tops
  topCutout: getCloudinaryAsset("top-cutout"),
  topCutoutBlack: getCloudinaryAsset("top-cutout-black"),
  topCutoutIvory: getCloudinaryAsset("top-cutout-ivory"),

  // Mock Neck Tops
  topMockNeck: getCloudinaryAsset("top-mock-neck"),
  topMockNeckChocolate: getCloudinaryAsset("top-mock-neck-chocolate"),
  topMockNeckBlack: getCloudinaryAsset("top-mock-neck-black"),

  // Halter Tops
  topHalter: getCloudinaryAsset("top-halter"),
  topHalterIvory: getCloudinaryAsset("top-halter-ivory"),
  topHalterBlack: getCloudinaryAsset("top-halter-black"),

  // Off Shoulder Tops
  topOffShoulder: getCloudinaryAsset("top-off-shoulder"),
  topOffShoulderBlack: getCloudinaryAsset("top-off-shoulder-black"),
  topOffShoulderIvory: getCloudinaryAsset("top-off-shoulder-ivory"),

  // Seamless Crew Tops
  topCrew: getCloudinaryAsset("top-crew"),
  topCrewBlack: getCloudinaryAsset("top-crew-black"),
  topCrewRose: getCloudinaryAsset("top-crew-rose"),

  // Wrap Tops
  topWrap: getCloudinaryAsset("top-wrap"),
  topWrapChocolate: getCloudinaryAsset("top-wrap-chocolate"),
  topWrapBlack: getCloudinaryAsset("top-wrap-black"),
};

export default cloudinaryAssets;
