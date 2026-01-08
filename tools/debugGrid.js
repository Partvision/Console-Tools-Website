(function(){
    if(window.debugGridStyle){
        window.debugGridStyle.remove();
        window.debugGridStyle=null;
        return;
    }
    const style=document.createElement('style');
    style.textContent='body::before{content:"";position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999998;background-image:linear-gradient(rgba(255,0,0,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,0,.15) 1px,transparent 1px);background-size:20px 20px;}';
    document.head.appendChild(style);
    window.debugGridStyle=style;
})()