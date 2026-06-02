import type { VercelRequest, VercelResponse } from "@vercel/node";
import { head } from "@vercel/blob";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse
) {
  try {
    const blob = await head("subscription.json");

    const blobResponse = await fetch(blob.downloadUrl);

    if (!blobResponse.ok) {
      return response.status(500).json({
        error: "Impossible de lire la subscription depuis Blob",
        status: blobResponse.status,
        statusText: blobResponse.statusText,
      });
    }

    const subscription = await blobResponse.json();

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "CollecteInfo",
        body: "Test push serveur réussi 🚀",
      })
    );

    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(500).json({
      error: "Erreur pendant l’envoi du push",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}