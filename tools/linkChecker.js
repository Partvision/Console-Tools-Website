(function(){
    if(window.linkCheckerActive){
        if(window.linkCheckerPanel)window.linkCheckerPanel.remove();
        document.querySelectorAll('a.__link-checker-bad').forEach(a=>{a.style.outline='';a.classList.remove('__link-checker-bad');});
        window.linkCheckerActive=false;
        return;
    }
    window.linkCheckerActive=true;
    const links=[...document.querySelectorAll('a[href]')];
    let suspicious=0;
    links.forEach(a=>{
        const href=a.getAttribute('href')||'';
        if(href==='#' || href.toLowerCase().startsWith('javascript:') || href.trim()===''){
            a.style.outline='2px solid #ff6b6b';
            a.classList.add('__link-checker-bad');
            suspicious++;
        }
    });
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;bottom:20px;left:20px;background:#333;color:#fff;padding:8px 12px;border-radius:8px;font-family:monospace;font-size:13px;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,.3);min-width:200px;';
    const header=document.createElement('div');
    header.style.cssText='cursor:move;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;';
    const title=document.createElement('span');
    title.textContent='Link Checker';
    const closeBtn=document.createElement('button');
    closeBtn.textContent='×';
    closeBtn.style.cssText='padding:2px 6px;border:none;border-radius:4px;background:#555;color:#fff;cursor:pointer;font-size:11px;';
    header.appendChild(title);
    header.appendChild(closeBtn);
    const body=document.createElement('div');
    body.innerHTML='Links: '+links.length+'<br>Suspicious: '+suspicious;
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
    window.linkCheckerPanel=panel;

    closeBtn.onclick=function(){
        panel.remove();
        document.querySelectorAll('a.__link-checker-bad').forEach(a=>{a.style.outline='';a.classList.remove('__link-checker-bad');});
        window.linkCheckerActive=false;
    };

    function makeDraggable(el,handle){
        let isDown=false,startX,startY,startLeft,startTop;
        (handle||el).addEventListener('mousedown',function(e){
            isDown=true;
            const rect=el.getBoundingClientRect();
            startX=e.clientX;
            startY=e.clientY;
            startLeft=rect.left;
            startTop=rect.top;
            el.style.left=startLeft+'px';
            el.style.top=startTop+'px';
            el.style.right='auto';
            el.style.bottom='auto';
            e.preventDefault();
        });
        document.addEventListener('mousemove',function(e){
            if(!isDown)return;
            const dx=e.clientX-startX,dy=e.clientY-startY;
            el.style.left=startLeft+dx+'px';
            el.style.top=startTop+dy+'px';
        });
        document.addEventListener('mouseup',function(){isDown=false;});
    }
    makeDraggable(panel,header);
})()