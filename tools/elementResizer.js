(function(){
    if(window.elementResizerActive){
        document.removeEventListener('mousemove',window._elResizerMove);
        document.removeEventListener('mouseup',window._elResizerUp);
        if(window._elResizerHandle)window._elResizerHandle.remove();
        window.elementResizerActive=false;
        return;
    }
    window.elementResizerActive=true;
    let target=null, startW=0,startH=0,startX=0,startY=0;
    const handle=document.createElement('div');
    handle.style.cssText='position:fixed;bottom:12px;right:12px;padding:8px 10px;background:#333;color:#fff;border-radius:6px;z-index:999999;cursor:crosshair;font-family:monospace;';
    handle.textContent='Resizer: Click element';
    document.body.appendChild(handle);
    window._elResizerHandle=handle;
    handle.onclick=function(e){
        e.stopPropagation();
        handle.textContent='Click an element to resize';
        const onClick=function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            target=document.elementFromPoint(ev.clientX,ev.clientY);
            if(target && target!==handle && target.tagName!=='HTML' && target.tagName!=='BODY'){
                startW=target.offsetWidth;startH=target.offsetHeight;startX=ev.clientX;startY=ev.clientY;
                handle.textContent='Drag mouse to resize — release to finish';
                document.addEventListener('mousemove',window._elResizerMove);
                document.addEventListener('mouseup',window._elResizerUp);
                document.removeEventListener('click',onClick,true);
            }
        };
        document.addEventListener('click',onClick,true);
    };
    window._elResizerMove=function(ev){
        if(!target)return;
        const dx=ev.clientX-startX,dy=ev.clientY-startY;
        target.style.width=(startW+dx)+'px';
        target.style.height=(startH+dy)+'px';
        target.style.transition='none';
        target.style.boxSizing='border-box';
        target.style.outline='2px dashed rgba(255,107,107,0.9)';
    };
    window._elResizerUp=function(){
        if(target)target.style.outline='';
        document.removeEventListener('mousemove',window._elResizerMove);
        document.removeEventListener('mouseup',window._elResizerUp);
        handle.textContent='Resizer: Click element';
        target=null;
    };
})();