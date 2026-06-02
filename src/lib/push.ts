function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray.buffer;
}

export async function subscribeToPush() {
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim();

  if (!vapidPublicKey) {
    throw new Error("VITE_VAPID_PUBLIC_KEY manquante");
  }

  console.log("Longueur clé VAPID :", vapidPublicKey.length);

  const registration = await navigator.serviceWorker.register("/sw.js");

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Permission refusée");
  }

  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
}