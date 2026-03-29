import { ConvexHttpClient } from "convex/browser";

let client: ConvexHttpClient | null = null;

export function getConvexClient(url?: string) {
  if (!url) {
    return null;
  }

  if (!client) {
    client = new ConvexHttpClient(url);
  }

  return client;
}
