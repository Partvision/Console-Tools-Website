(function(){
    if(window.wordCountPanel){
        window.wordCountPanel.remove();
        window.wordCountPanel=null;
        window.wordCountActive=false;
        return;
    }
    if(window.wordCountActive)return;
    window.wordCountActive=true;
    
    const text=document.body.innerText;
    const words=text.trim().split(/\\s+/).filter(w=>w.length>0).length;
    const chars=text.length;
    const readingTime=Math.ceil(words/200);
    
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;top:20px;right:20px;background:#333;color:white;border-radius:8px;z-index:999999;font-family:monospace;min-width:220px;';
    const header=document.createElement('div');
    header.style.cssText='cursor:move;padding:8px 12px;border-bottom:1px solid #555;display:flex;justify-content:space-between;align-items:center;';
    const title=document.createElement('span');
    title.textContent='Word Count';
    const closeBtn=document.createElement('button');
    closeBtn.textContent='×';
    closeBtn.style.cssText='background:#f44336;color:white;border:none;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:12px;';
    header.appendChild(title);
    header.appendChild(closeBtn);
    const body=document.createElement('div');
    body.style.cssText='padding:10px 12px;';
    body.innerHTML='<p>Words: '+words+'</p><p>Characters: '+chars+'</p><p>Reading Time: ~'+readingTime+' min</p>';
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
    window.wordCountPanel=panel;

    closeBtn.onclick=function(){
        panel.remove();
        window.wordCountPanel=null;
        window.wordCountActive=false;
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