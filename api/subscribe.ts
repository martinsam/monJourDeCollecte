import type {
  VercelRequest,
  VercelResponse,
} from "@vercel/node";

import { put } from "@vercel/blob";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {

  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  await put(
    "subscription.json",
    JSON.stringify(request.body),
    {
      access: "public",
      addRandomSuffix: false,
    }
  );

  return response.status(200).json({
    ok: true,
  });
}