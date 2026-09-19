import assetsJson from "@/content/assets.json";
import type { AssetsContent } from "../types";

export const assets = assetsJson as unknown as AssetsContent;
