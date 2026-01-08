(function(){
    if(window.__loremPanel){
        window.__loremPanel.remove();
        window.__loremPanel=null;
        return;
    }
    const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.";
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;right:20px;top:20px;width:300px;background:#fafafa;color:#111;border-radius:8px;padding:10px;z-index:999999;font-family:monospace;';
    panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Sample Text</strong><button id="__l_close">×</button></div><div style="display:flex;gap:6px;margin-bottom:8px;"><input id="__l_count" type="number" min="1" max="10" value="3" style="width:70px;padding:6px;border-radius:6px;border:1px solid #ddd"><button id="__l_insert" style="flex:1;padding:6px;border-radius:6px;background:#2b6;color:#fff;border:none;cursor:pointer">Insert</button></div><div style="font-size:13px;color:#444">Click Insert to paste into focused textarea or copy to clipboard.</div>';
    document.body.appendChild(panel);
    window.__loremPanel=panel;
    panel.querySelector('#__l_close').onclick=function(){ panel.remove(); window.__loremPanel=null; };
    panel.querySelector('#__l_insert').onclick=function(){
        const n = Math.max(1,Math.min(10, Number(panel.querySelector('#__l_count').value||3)));
        const text = Array.from({length:n}).map(()=>sample).join('\n\n');
        const active = document.activeElement;
        if(active && (active.tagName==='TEXTAREA' || (active.tagName==='INPUT' && /text|search|email|url|tel/.test(active.type)))){
            active.value = active.value + (active.value?'\n\n':'') + text;
            active.dispatchEvent(new Event('input',{bubbles:true}));
        }else{
            navigator.clipboard.writeText(text).then(()=>alert('Sample text copied to clipboard'));
        }
    };
})();