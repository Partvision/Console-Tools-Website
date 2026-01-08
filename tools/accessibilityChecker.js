(function(){
    if(window.accessibilityCheckerActive){
        if(window.accessibilityCheckerPanel)window.accessibilityCheckerPanel.remove();
        document.querySelectorAll('.a11y-highlight').forEach(el=>{el.style.outline='';el.classList.remove('a11y-highlight');});
        window.accessibilityCheckerActive=false;
        return;
    }
    window.accessibilityCheckerActive=true;
    const issues=[];
    document.querySelectorAll('img').forEach(img=>{
        if(!img.getAttribute('alt'))issues.push({el:img,msg:'Img missing alt'});
    });
    document.querySelectorAll('input,textarea,select').forEach(inp=>{
        const id=inp.id||inp.getAttribute('name')||'';
        const hasLabel=!!(document.querySelector('label[for="'+id+'"]') || inp.closest('label'));
        if(!hasLabel)issues.push({el:inp,msg:'Form control missing label'});
    });
    // simple contrast check (approx): check inline/background contrast via luminance diff for text nodes
    // highlight issues
    issues.forEach(it=>{
        it.el.classList.add('a11y-highlight');
        it.el.style.outline='3px dashed #ff6b6b';
        it.el.style.outlineOffset='4px';
    });
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;bottom:20px;left:20px;background:#222;color:#fff;padding:10px;border-radius:8px;font-family:monospace;z-index:999999;min-width:220px;box-shadow:0 6px 18px rgba(0,0,0,.25);';
    const title=document.createElement('div');title.textContent='Accessibility Checker';title.style.fontWeight='600';title.style.marginBottom='6px';
    const body=document.createElement('div');
    body.innerHTML='Issues found: '+issues.length;
    panel.appendChild(title);panel.appendChild(body);
    const close=document.createElement('button');close.textContent='×';close.style.cssText='position:absolute;right:8px;top:6px;border:none;background:transparent;color:#fff;font-size:14px;cursor:pointer;';
    panel.appendChild(close);
    document.body.appendChild(panel);
    window.accessibilityCheckerPanel=panel;
    close.onclick=function(){panel.remove();document.querySelectorAll('.a11y-highlight').forEach(el=>{el.style.outline='';el.classList.remove('a11y-highlight');});window.accessibilityCheckerActive=false;};
})();