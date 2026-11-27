// 只缓存图标等静态资源；页面本身永远走网络，保证刷新即最新
const CACHE='tj-static-v1';
const STATIC=['./icon-192.png','./icon-180.png','./icon-512.png','./manifest.webmanifest'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(STATIC); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET'){ return; }
  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req, {cache:'no-cache'}).then(function(res){
        var c = res.clone();
        caches.open(CACHE).then(function(x){ x.put('./index.html', c); });
        return res;
      }).catch(function(){ return caches.match('./index.html'); })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function(r){ return r || fetch(req); })
  );
});
