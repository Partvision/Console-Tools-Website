(function(){
    if(window.colorPickerActive)return;
    window.colorPickerActive=true;
    
    const canvas=document.createElement('canvas');
    canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;cursor:crosshair;background:transparent';
    document.body.appendChild(canvas);
    
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    let ready=false;
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = function() {
        html2canvas(document.body).then(function(screenshot) {
            ctx.drawImage(screenshot, 0, 0);
            ready=true;
        });
    };
    document.head.appendChild(script);
    
    const tooltip=document.createElement('div');
    tooltip.style.cssText='position:fixed;padding:8px 12px;background:#333;color:white;border-radius:4px;font-family:monospace;z-index:1000000;pointer-events:none;display:none';
    document.body.appendChild(tooltip);
    
    canvas.addEventListener('mousemove',function(e){
        if(!ready)return;
        const x=e.clientX,y=e.clientY;
        const pixel=ctx.getImageData(x,y,1,1).data;
        const hex='#'+('000000'+((pixel[0]<<16)|(pixel[1]<<8)|pixel[2]).toString(16)).slice(-6);
        tooltip.textContent=hex;
        tooltip.style.left=x+10+'px';
        tooltip.style.top=y-30+'px';
        tooltip.style.display='block';
    });
    
    canvas.addEventListener('click',function(e){
        if(!ready)return;
        const x=e.clientX,y=e.clientY;
        const pixel=ctx.getImageData(x,y,1,1).data;
        const hex='#'+('000000'+((pixel[0]<<16)|(pixel[1]<<8)|pixel[2]).toString(16)).slice(-6);
        navigator.clipboard.writeText(hex).then(()=>{alert('Color '+hex+' copied to clipboard!');});
        cleanup();
    });
    
    canvas.addEventListener('contextmenu',function(e){
        e.preventDefault();
        cleanup();
    });

    document.addEventListener('keydown',function onKey(e){
        if(e.key==='Escape'){
            document.removeEventListener('keydown',onKey);
            cleanup();
        }
    });
    
    function cleanup(){
        window.colorPickerActive=false;
        if(canvas.parentNode)document.body.removeChild(canvas);
        if(tooltip.parentNode)document.body.removeChild(tooltip);
    }
})()