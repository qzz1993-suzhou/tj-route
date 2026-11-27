const CACHE='tj-route-v14';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-180.png','./icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET'){return;}
  var isDoc = e.request.mode==='navigate';
  if(isDoc){
    // 页面：先联网拿最新，失败再用缓存（刷新即最新）
    e.respondWith(fetch(e.request,{cache:'reload'}).then(function(r){
      var c=r.clone();
      caches.open(CACHE).then(function(x){x.put(e.request,c);});
      return r;
    }).catch(function(){ return caches.match(e.request).then(function(r){ return r || caches.match('./index.html'); }); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request);}));
});
