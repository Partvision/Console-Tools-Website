(function(){
    if(window.cssEditorPanel){
        window.cssEditorPanel.style.display=window.cssEditorPanel.style.display==='none'?'block':'none';
        return;
    }
    
    window.cssEditorActive=true;
    
    const panel=document.createElement('div');
    panel.id='css-editor-panel';
    panel.style.cssText='position:fixed;top:20px;right:20px;width:300px;background:#333;color:white;border-radius:8px;z-index:999999;font-family:monospace;box-shadow:0 6px 18px rgba(0,0,0,.25);';
    const header=document.createElement('div');
    header.style.cssText='cursor:move;padding:8px 12px;border-bottom:1px solid #555;display:flex;justify-content:space-between;align-items:center;';
    const title=document.createElement('span');
    title.textContent='CSS Editor';
    const closeBtn=document.createElement('button');
    closeBtn.textContent='×';
    closeBtn.style.cssText='background:#f44336;color:white;border:none;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:12px;';
    header.appendChild(title);
    header.appendChild(closeBtn);
    const body=document.createElement('div');
    body.style.cssText='padding:10px 12px;';
    body.innerHTML='<input id="css-selector" placeholder="selector" style="width:100%;margin:5px 0;padding:4px;border-radius:4px;border:1px solid #555;background:#222;color:#fff;"><textarea id="css-rules" placeholder="css rules" style="width:100%;height:100px;margin:5px 0;padding:4px;border-radius:4px;border:1px solid #555;background:#222;color:#fff;"></textarea><button id="apply-css" style="background:#4CAF50;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer">Apply</button>';
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
    window.cssEditorPanel=panel;
    
    document.getElementById('apply-css').addEventListener('click',function(){
        const selector=document.getElementById('css-selector').value;
        const rules=document.getElementById('css-rules').value;
        try{
            document.querySelectorAll(selector).forEach(el=>el.style.cssText+=rules);
        }catch(e){alert('Invalid selector');}
    });

    closeBtn.onclick=function(){
        panel.remove();
        window.cssEditorPanel=null;
        window.cssEditorActive=false;
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