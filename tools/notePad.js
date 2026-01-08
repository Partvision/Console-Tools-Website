(function(){
    if(window.notePadPanel){
        window.notePadPanel.style.display=window.notePadPanel.style.display==='none'?'block':'none';
        return;
    }
    const storageKey='__draggable_notes__:'+location.host+location.pathname;
    function loadNotes(){
        try{return localStorage.getItem(storageKey)||'';}catch(e){return '';}
    }
    function saveNotes(val){
        try{localStorage.setItem(storageKey,val);}catch(e){}
    }
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;top:80px;right:20px;width:260px;height:200px;background:#fff8c4;border:1px solid #e0c96b;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.15);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:flex;flex-direction:column;';
    const header=document.createElement('div');
    header.textContent='Notes';
    header.style.cssText='padding:6px 10px;font-size:13px;background:#f0d97c;border-radius:8px 8px 0 0;cursor:move;display:flex;align-items:center;justify-content:space-between;user-select:none;';
    const titleSpan=document.createElement('span');
    titleSpan.textContent='Notes';
    const btns=document.createElement('div');
    const minimizeBtn=document.createElement('button');
    minimizeBtn.textContent='–';
    minimizeBtn.style.cssText='border:none;background:transparent;font-size:14px;cursor:pointer;margin-right:4px;';
    const closeBtn=document.createElement('button');
    closeBtn.textContent='×';
    closeBtn.style.cssText='border:none;background:transparent;font-size:14px;cursor:pointer;';
    btns.appendChild(minimizeBtn);
    btns.appendChild(closeBtn);
    header.innerHTML='';
    header.appendChild(titleSpan);
    header.appendChild(btns);
    const textarea=document.createElement('textarea');
    textarea.style.cssText='flex:1;border:none;resize:none;padding:8px 10px;font-size:13px;background:transparent;outline:none;';
    textarea.value=loadNotes();
    textarea.addEventListener('input',function(){saveNotes(this.value);});
    panel.appendChild(header);
    panel.appendChild(textarea);
    document.body.appendChild(panel);
    window.notePadPanel=panel;

    function makeDraggable(el, handle){
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

    minimizeBtn.onclick=function(e){
        e.stopPropagation();
        if(textarea.style.display==='none'){
            textarea.style.display='block';
            panel.style.height='200px';
        }else{
            textarea.style.display='none';
            panel.style.height='34px';
        }
    };
    closeBtn.onclick=function(e){
        e.stopPropagation();
        panel.remove();
        window.notePadPanel=null;
    };
    document.addEventListener('keydown',function onKey(e){
        if(e.key==='Escape'){
            document.removeEventListener('keydown',onKey);
            if(window.notePadPanel){
                window.notePadPanel.remove();
                window.notePadPanel=null;
            }
        }
    });
})()