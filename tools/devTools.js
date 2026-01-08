(function(){
    if(window.__liteDevTools){
        window.__liteDevTools.remove();
        window.__liteDevTools=null;
        document.body.style.cursor='';
        return;
    }
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;right:20px;top:20px;width:260px;background:#222;color:#fff;border-radius:8px;padding:8px;z-index:999999;font-family:monospace;font-size:13px;box-shadow:0 6px 18px rgba(0,0,0,.3)';
    panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Dev Tools (Lite)</strong><button id="__dev_close" style="background:#444;color:#fff;border:none;border-radius:4px;padding:2px 6px;cursor:pointer">×</button></div>';
    const inspectBtn=document.createElement('button'); inspectBtn.textContent='Inspect (click element)'; inspectBtn.style.cssText='width:100%;padding:8px;margin-bottom:6px;border-radius:6px;border:none;background:#2b6;color:#fff;cursor:pointer';
    const outlineBtn=document.createElement('button'); outlineBtn.textContent='Toggle outlines'; outlineBtn.style.cssText='width:100%;padding:8px;margin-bottom:6px;border-radius:6px;border:none;background:#444;color:#fff;cursor:pointer';
    const clearBtn=document.createElement('button'); clearBtn.textContent='Clear outlines'; clearBtn.style.cssText='width:100%;padding:8px;border-radius:6px;border:none;background:#a44;color:#fff;cursor:pointer';
    panel.appendChild(inspectBtn); panel.appendChild(outlineBtn); panel.appendChild(clearBtn);
    document.body.appendChild(panel);
    window.__liteDevTools=panel;
    let outlining=false;
    inspectBtn.onclick=function(){
        document.body.style.cursor='crosshair';
        const onClick=function(e){
            e.preventDefault(); e.stopPropagation();
            const el=document.elementFromPoint(e.clientX,e.clientY);
            console.dir(el);
            alert('Element logged to console: '+(el.tagName||''));
            document.body.style.cursor='';
            document.removeEventListener('click',onClick,true);
        };
        document.addEventListener('click',onClick,true);
    };
    outlineBtn.onclick=function(){
        outlining=!outlining;
        if(outlining){
            document.querySelectorAll('*').forEach(el=>{ el.__prevOutline=el.style.outline; el.style.outline='1px solid rgba(255,107,107,0.8)'; });
        }else{
            document.querySelectorAll('*').forEach(el=>{ if(el.__prevOutline!==undefined) el.style.outline=el.__prevOutline; delete el.__prevOutline; });
        }
    };
    clearBtn.onclick=function(){ document.querySelectorAll('*').forEach(el=>{ el.style.outline=''; delete el.__prevOutline; }); outlining=false; };
    document.getElementById('__dev_close').onclick=function(){ panel.remove(); window.__liteDevTools=null; document.body.style.cursor=''; };
})();