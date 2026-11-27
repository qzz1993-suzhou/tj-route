// 旧版本遗留：注销自己并清空所有缓存
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{
      var keys = await caches.keys();
      await Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }catch(err){}
    try{ await self.registration.unregister(); }catch(err){}
    var cs = await self.clients.matchAll({type:'window'});
    cs.forEach(function(c){ try{ c.navigate(c.url); }catch(e){} });
  })());
});
