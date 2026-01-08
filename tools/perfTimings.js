(function(){
    if(window.perfTimingsPanel){
        window.perfTimingsPanel.remove();
        window.perfTimingsPanel=null;
        return;
    }
    const t=performance.timing || {};
    const nav=performance.getEntriesByType('navigation')[0]||{};
    const resources=performance.getEntriesByType('resource')||[];
    const timings={
        dns: (t.domainLookupEnd - t.domainLookupStart)||0,
        connect: (t.connectEnd - t.connectStart)||0,
        ttfb: (t.responseStart - t.requestStart)||0,
        domLoad: (t.domContentLoadedEventEnd - t.requestStart)||0,
        load: (t.loadEventEnd - t.requestStart)||0,
        resources: resources.length
    };
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;top:20px;left:20px;background:#111;color:#fff;padding:12px;border-radius:8px;font-family:monospace;z-index:999999;box-shadow:0 6px 18px rgba(0,0,0,.25);min-width:240px;';
    panel.innerHTML='<div style="font-weight:600;margin-bottom:8px">Performance Timings</div><div>DNS: '+timings.dns+' ms</div><div>Connect: '+timings.connect+' ms</div><div>TTFB: '+timings.ttfb+' ms</div><div>DOM load: '+timings.domLoad+' ms</div><div>Load: '+timings.load+' ms</div><div>Resources: '+timings.resources+'</div>';
    const close=document.createElement('button');close.textContent='×';close.style.cssText='position:absolute;right:8px;top:6px;border:none;background:transparent;color:#fff;font-size:14px;cursor:pointer;';
    panel.appendChild(close);
    close.onclick=function(){panel.remove();window.perfTimingsPanel=null;};
    document.body.appendChild(panel);
    window.perfTimingsPanel=panel;
})();