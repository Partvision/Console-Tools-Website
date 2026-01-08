(function(){
    if(window.imageInfoActive)return;
    window.imageInfoActive=true;
    
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;cursor:pointer';
    document.body.appendChild(overlay);
    
    const images=document.querySelectorAll('img');
    images.forEach(img=>{
        img.addEventListener('mouseenter',function(){this.style.outline='2px solid #ff6b6b';this.style.outlineOffset='2px';});
        img.addEventListener('mouseleave',function(){this.style.outline='';this.style.outlineOffset='';});
    });
    
    overlay.addEventListener('click',function(e){
        const elem=document.elementFromPoint(e.clientX,e.clientY);
        if(elem&&elem.tagName==='IMG'){
            const img=elem;
            alert('Image: '+img.src.split('/').pop()+'\\nDimensions: '+img.naturalWidth+' × '+img.naturalHeight);
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
        window.imageInfoActive=false;
        if(overlay.parentNode)document.body.removeChild(overlay);
        images.forEach(img=>{img.style.outline='';img.style.outlineOffset='';});
    }
    
    if(images.length===0){alert('No images found!');cleanup();}
})()