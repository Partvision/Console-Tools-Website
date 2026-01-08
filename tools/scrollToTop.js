(function(){
    if(window.scrollToTopActive){
        if(window.scrollToTopBtn)window.scrollToTopBtn.remove();
        window.scrollToTopActive=false;
        return;
    }
    window.scrollToTopActive=true;
    const btn=document.createElement('button');
    btn.textContent='↑ Top';
    btn.style.cssText='position:fixed;bottom:20px;right:20px;padding:10px 14px;border:none;border-radius:20px;background:#333;color:#fff;font-family:sans-serif;font-size:14px;cursor:pointer;z-index:999999;box-shadow:0 4px 10px rgba(0,0,0,.3);opacity:.8';
    btn.onclick=function(){
        window.scrollTo({top:0,behavior:"smooth"});
    };
    btn.onmouseenter=function(){btn.style.opacity='1';};
    btn.onmouseleave=function(){btn.style.opacity='.8';};
    document.body.appendChild(btn);
    window.scrollToTopBtn=btn;
})()