(function(){
    if(window.__rulerOverlay){
        window.__rulerOverlay.remove();
        window.__rulerOverlay=null;
        return;
    }
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:auto;z-index:999999;';
    const ruler=document.createElement('div');
    ruler.style.cssText='position:fixed;left:20px;top:80px;width:300px;height:36px;background:rgba(0,0,0,0.7);color:#fff;border-radius:6px;padding:6px;display:flex;align-items:center;gap:8px;cursor:move;font-family:monospace;';
    ruler.innerHTML='<div id="__r_val">0 × 0 px</div><button id="__r_close" style="margin-left:auto;background:#e44;color:#fff;border:none;padding:6px;border-radius:6px;cursor:pointer">×</button>';
    overlay.appendChild(ruler);
    document.body.appendChild(overlay);
    window.__rulerOverlay=overlay;
    const val=ruler.querySelector('#__r_val');
    let isDown=false, startX=0, startY=0, startLeft=20, startTop=80, measuring=false, mStart=null;
    ruler.addEventListener('mousedown', function(e){
        if(e.button!==0) return;
        isDown=true; startX=e.clientX; startY=e.clientY;
        const rect=ruler.getBoundingClientRect();
        startLeft=rect.left; startTop=rect.top;
        ruler.style.left=startLeft+'px'; ruler.style.top=startTop+'px'; ruler.style.right='auto';
        e.preventDefault();
    });
    document.addEventListener('mousemove', function(e){
        if(isDown){
            const dx=e.clientX-startX, dy=e.clientY-startY;
            ruler.style.left = (startLeft+dx) + 'px';
            ruler.style.top = (startTop+dy) + 'px';
        }
        if(measuring && mStart){
            const w = Math.abs(e.clientX - mStart.x), h = Math.abs(e.clientY - mStart.y);
            val.textContent = w+' × '+h+' px';
        }
    });
    document.addEventListener('mouseup', function(e){
        isDown=false;
        if(measuring){ measuring=false; mStart=null; }
    });
    ruler.addEventListener('dblclick', function(e){
        // start measuring from click point
        measuring=true; mStart={x:e.clientX,y:e.clientY};
    });
    ruler.querySelector('#__r_close').onclick=function(){ overlay.remove(); window.__rulerOverlay=null; };
    // initial position
    ruler.style.left='20px'; ruler.style.top='80px';
})();