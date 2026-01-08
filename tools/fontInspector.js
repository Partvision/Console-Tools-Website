(function(){
    if(window.fontInspectorActive)return;
    window.fontInspectorActive=true;
    
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;cursor:pointer';
    document.body.appendChild(overlay);
    
    const tooltip=document.createElement('div');
    tooltip.style.cssText='position:fixed;padding:12px;background:#333;color:white;border-radius:6px;font-family:monospace;font-size:14px;z-index:1000000;pointer-events:none;max-width:300px;display:none';
    document.body.appendChild(tooltip);
    
    overlay.addEventListener('mouseover',function(e){
        const elem=document.elementFromPoint(e.clientX,e.clientY);
        if(elem&&elem!==overlay){
            const comp=window.getComputedStyle(elem);
            elem.style.outline='2px solid #ff6b6b';
            tooltip.innerHTML='<strong>Font:</strong> '+comp.fontFamily+'<br><strong>Size:</strong> '+comp.fontSize+'<br><strong>Weight:</strong> '+comp.fontWeight;
            tooltip.style.left=e.clientX+10+'px';
            tooltip.style.top=e.clientY+10+'px';
            tooltip.style.display='block';
        }
    });
    
    overlay.addEventListener('mouseout',function(e){
        const elem=document.elementFromPoint(e.clientX,e.clientY);
        if(elem&&elem!==overlay)elem.style.outline='';
        tooltip.style.display='none';
    });
    
    overlay.addEventListener('click',function(e){
        const elem=document.elementFromPoint(e.clientX,e.clientY);
        if(elem&&elem!==overlay){
            const comp=window.getComputedStyle(elem);
            alert('Font: '+comp.fontFamily+'\\nSize: '+comp.fontSize+'\\nWeight: '+comp.fontWeight);
        }
        cleanup();
    });

    document.addEventListener('keydown',function onKey(e){
        if(e.key==='Escape'){
            document.removeEventListener('keydown',onKey);
            cleanup();
        }
    });
    
    function cleanup(){
        window.fontInspectorActive=false;
        if(overlay.parentNode)document.body.removeChild(overlay);
        if(tooltip.parentNode)document.body.removeChild(tooltip);
    }
})()