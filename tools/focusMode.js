(function(){
    if(window.focusModeOverlay){
        window.focusModeOverlay.remove();
        window.focusModeOverlay=null;
        return;
    }
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);z-index:999997;pointer-events:none;transition:opacity .2s;';
    document.body.appendChild(overlay);
    window.focusModeOverlay=overlay;
    const main=document.querySelector('main,article,[role="main"],.content,.post');
    if(main){
        main.style.position='relative';
        main.style.zIndex=999998;
        main.style.boxShadow='0 0 0 3px rgba(255,255,255,.6)';
        setTimeout(()=>{main.style.boxShadow='';},1500);
    }
})()