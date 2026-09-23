// Serves files from a dropped folder. index.html stores them in the
// 'aah-site' cache under <scope>/__site__/<path>; nothing leaves the device.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  var root = new URL('__site__/', self.registration.scope);
  var u = new URL(e.request.url);
  if (u.origin !== root.origin || u.pathname.indexOf(root.pathname) !== 0) return;
  u.search = ''; u.hash = '';
  e.respondWith((async function () {
    var cache = await caches.open('aah-site');
    var res = await cache.match(u.href);
    if (!res && u.pathname.slice(-1) === '/') res = await cache.match(u.href + 'index.html');
    return res || new Response('Not found: ' + u.pathname.slice(root.pathname.length),
      { status: 404, headers: { 'Content-Type': 'text/plain' } });
  })());
});
