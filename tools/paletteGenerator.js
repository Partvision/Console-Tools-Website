(function(){
    if(window.__palettePanel){
        window.__palettePanel.remove();
        window.__palettePanel=null;
        return;
    }
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;left:20px;bottom:20px;width:320px;background:#111;color:#fff;border-radius:8px;padding:10px;z-index:999999;font-family:monospace;';
    panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Palette</strong><button id="__pal_close">×</button></div><div style="display:flex;gap:6px;margin-bottom:8px;"><input id="__pal_seed" placeholder="#3498db or keyword" style="flex:1;padding:6px;border-radius:6px;border:1px solid #333;background:#000;color:#fff"><button id="__pal_gen" style="padding:6px;border-radius:6px;background:#2b6;border:none;cursor:pointer">Generate</button></div><div id="__pal_out" style="display:flex;gap:6px;flex-wrap:wrap;"></div>';
    document.body.appendChild(panel);
    window.__palettePanel=panel;
    panel.querySelector('#__pal_close').onclick=function(){ panel.remove(); window.__palettePanel=null; };
    function hexFromRgb(r,g,b){ return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join(''); }
    function randShade(hex, i){
        // simple manipulation: convert hex to rgb, shift brightness
        hex = hex.replace('#','');
        let r=parseInt(hex.slice(0,2),16), g=parseInt(hex.slice(2,4),16), b=parseInt(hex.slice(4,6),16);
        const factor = 1 - (i-2)*0.12;
        r=Math.max(0,Math.min(255,Math.round(r*factor)));
        g=Math.max(0,Math.min(255,Math.round(g*factor)));
        b=Math.max(0,Math.min(255,Math.round(b*factor)));
        return hexFromRgb(r,g,b);
    }
    panel.querySelector('#__pal_gen').onclick=function(){
        let seed=panel.querySelector('#__pal_seed').value.trim()||'#2ecc71';
        if(!seed.startsWith('#')){
            // simple hash from string to color
            let h=0; for(let i=0;i<seed.length;i++) h = (h<<5)-h + seed.charCodeAt(i);
            const r=(h>>16)&255,g=(h>>8)&255,b=(h)&255; seed='#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
        }
        const out=panel.querySelector('#__pal_out'); out.innerHTML='';
        for(let i=0;i<5;i++){
            const c=randShade(seed,i);
            const sw=document.createElement('div'); sw.style.cssText='width:56px;height:56px;border-radius:6px;display:flex;align-items:end;justify-content:center;padding:6px;font-size:11px;cursor:pointer;background:'+c+';color:'+(i>2?'#fff':'#000')+';border:1px solid rgba(255,255,255,0.04)';
            sw.textContent=c;
            sw.onclick=function(){ navigator.clipboard.writeText(c).then(()=>{ sw.textContent='Copied'; setTimeout(()=>sw.textContent=c,800); }); };
            out.appendChild(sw);
        }
    };
})();