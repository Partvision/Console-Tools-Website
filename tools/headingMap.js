(function(){
    if(window.headingMapPanel){
        window.headingMapPanel.remove();
        window.headingMapPanel=null;
        return;
    }
    const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    if(!headings.length){alert('No headings found');return;}
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;top:20px;left:20px;max-height:70vh;width:260px;overflow:auto;background:#222;color:#fff;border-radius:8px;font-family:monospace;font-size:13px;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,.3)';
    const header=document.createElement('div');
    header.style.cssText='cursor:move;padding:8px 10px;border-bottom:1px solid #444;display:flex;justify-content:space-between;align-items:center;';
    const title=document.createElement('strong');
    title.textContent='Heading Map';
    const closeBtn=document.createElement('button');
    closeBtn.textContent='×';
    closeBtn.style.cssText='border:none;background:#444;color:#fff;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:11px;';
    header.appendChild(title);
    header.appendChild(closeBtn);
    const list=document.createElement('div');
    list.style.cssText='padding:8px 10px;';
    list.innerHTML=headings.map((h,i)=>{
        const lvl=+h.tagName[1];
        const text=(h.textContent||'').trim().slice(0,80);
        return '<div data-idx="'+i+'" style="margin-left:'+((lvl-1)*8)+'px;margin-bottom:4px;cursor:pointer;"><span style="color:#888;">'+h.tagName.toLowerCase()+':</span> '+(text||'<em>empty</em>')+'</div>';
    }).join('');
    panel.appendChild(header);
    panel.appendChild(list);
    list.querySelectorAll('[data-idx]').forEach(el=>{
        el.onclick=function(){
            const idx=+this.getAttribute('data-idx');
            const target=headings[idx];
            if(target){
                target.scrollIntoView({behavior:'smooth',block:'center'});
                target.style.transition='box-shadow .3s';
                target.style.boxShadow='0 0 0 3px #ff6b6b';
                setTimeout(()=>{target.style.boxShadow='';},1500);
            }
        };
    });
    closeBtn.onclick=function(){
        panel.remove();
        window.headingMapPanel=null;
    };
    document.body.appendChild(panel);
    window.headingMapPanel=panel;

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