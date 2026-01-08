(function(){
    if(window.__fpsCounter){
        cancelAnimationFrame(window.__fpsCounter.raf);
        if(window.__fpsCounter.el)window.__fpsCounter.el.remove();
        window.__fpsCounter=null;
        return;
    }
    const el=document.createElement('div');
    el.style.cssText='position:fixed;left:12px;top:12px;padding:6px 8px;background:#111;color:#fff;font-family:monospace;font-size:13px;border-radius:6px;z-index:999999;opacity:.9';
    el.textContent='FPS';
    document.body.appendChild(el);
    let last=performance.now(),frames=0,fps=0;
    function loop(now){
        frames++;
        const dt=now-last;
        if(dt>=500){
            fps=Math.round((frames*1000)/(dt));
            frames=0;
            last=now;
            el.textContent='FPS: '+fps;
        }
        window.__fpsCounter.raf=requestAnimationFrame(loop);
    }
    window.__fpsCounter={el:el,raf:requestAnimationFrame(loop)};
})();