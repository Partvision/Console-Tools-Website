(function(){
    if(window.layoutDebuggerActive){
        document.querySelectorAll('.layout-debug-outline').forEach(el=>el.classList.remove('layout-debug-outline'));
        if(window.layoutDebuggerStyle)document.head.removeChild(window.layoutDebuggerStyle);
        window.layoutDebuggerActive=false;
        return;
    }
    
    window.layoutDebuggerActive=true;
    
    const style=document.createElement('style');
    style.textContent='.layout-debug-outline{outline:1px solid #ff6b6b !important}';
    document.head.appendChild(style);
    window.layoutDebuggerStyle=style;
    
    document.querySelectorAll('*').forEach(el=>{
        if(el.tagName!=='SCRIPT'&&el.tagName!=='STYLE'&&el.tagName!=='META')el.classList.add('layout-debug-outline');
    });
})()