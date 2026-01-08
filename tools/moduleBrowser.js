(function(){
    if(window.__moduleBrowserPanel){
        window.__moduleBrowserPanel.remove();
        window.__moduleBrowserPanel=null;
        return;
    }
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;left:20px;top:20px;width:360px;max-height:70vh;overflow:auto;background:#222;color:#fff;border-radius:8px;padding:8px;z-index:999999;font-family:monospace;font-size:13px;box-shadow:0 6px 18px rgba(0,0,0,.3)';
    const header=document.createElement('div');
    header.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';
    header.innerHTML='<strong>Module Browser</strong>';
    const close=document.createElement('button');
    close.textContent='×';
    close.style.cssText='background:#444;color:#fff;border:none;border-radius:4px;padding:2px 6px;cursor:pointer';
    header.appendChild(close);
    panel.appendChild(header);
    const search=document.createElement('input');
    search.placeholder='Filter scripts by src or content...';
    search.style.cssText='width:100%;padding:6px;margin-bottom:8px;border-radius:6px;border:1px solid #555;background:#111;color:#fff';
    panel.appendChild(search);
    const list=document.createElement('div');
    panel.appendChild(list);
    function build(){
        list.innerHTML='';
        const scripts=[...document.scripts];
        scripts.forEach((s,i)=>{
            const src=s.src||'(inline)';
            const code=s.src?src:(s.textContent||'').slice(0,200).replace(/</g,'&lt;');
            const item=document.createElement('div');
            item.style.cssText='padding:8px;border-radius:6px;margin-bottom:6px;background:#111;border:1px solid #333';
            item.innerHTML='<div style="color:#9aa;font-size:12px;margin-bottom:6px;">'+src+'</div><div style="font-size:12px;color:#ddd;max-height:80px;overflow:auto;">'+code+'</div>';
            const btnRow=document.createElement('div');
            btnRow.style.cssText='display:flex;gap:6px;margin-top:6px';
            const run=document.createElement('button'); run.textContent='Run inline'; run.style.cssText='padding:6px;background:#2b6;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px';
            run.onclick=function(){ try { if(!s.src) eval(s.textContent); else fetch(s.src).then(r=>r.text()).then(t=>eval(t)); } catch(e){alert('Error: '+e.message);} };
            const copy=document.createElement('button'); copy.textContent='Copy'; copy.style.cssText='padding:6px;background:#444;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px';
            copy.onclick=function(){ navigator.clipboard.writeText(s.src?('fetch(\"'+s.src+'\").then(r=>r.text()).then(t=>eval(t))'):s.textContent).then(()=>{copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy',1000)}); };
            btnRow.appendChild(run); btnRow.appendChild(copy);
            item.appendChild(btnRow);
            list.appendChild(item);
        });
    }
    build();
    search.addEventListener('input',function(){
        const q=this.value.toLowerCase().trim();
        document.querySelectorAll('div',list).forEach(()=>{}); // noop to satisfy some linters
        list.querySelectorAll('div').forEach(div=>{
            const txt=div.textContent.toLowerCase();
            div.style.display = (!q || txt.includes(q)) ? '' : 'none';
        });
    });
    close.onclick=function(){panel.remove();window.__moduleBrowserPanel=null;};
    document.body.appendChild(panel);
    window.__moduleBrowserPanel=panel;
})();