const CACHE_NAME = "my-class-day-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["./", "./index.html", "./manifest.json"])
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "My Class Day", {
      body: data.body || "You have an upcoming class.",
      icon: "./icon-192.png",
      badge: "./icon-192.png",
      data: { url: data.url || "./" }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "./")
  );
});
