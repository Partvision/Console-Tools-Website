(function(){
    if(window.__clipboardHistoryPanel){
        window.__clipboardHistoryPanel.remove();
        window.__clipboardHistoryPanel=null;
        return;
    }
    const key='__clip_history_v1';
    function load(){ try{ return JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){return [];} }
    function save(arr){ try{ localStorage.setItem(key, JSON.stringify(arr.slice(0,50))); }catch(e){} }
    const history = load();
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;left:20px;top:20px;width:320px;background:#111;color:#fff;border-radius:8px;padding:10px;z-index:999999;font-family:monospace;';
    panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Clipboard History</strong><button id="__ch_close">×</button></div><div id="__ch_list" style="max-height:280px;overflow:auto;"></div>';
    document.body.appendChild(panel);
    window.__clipboardHistoryPanel=panel;
    panel.querySelector('#__ch_close').onclick=function(){ panel.remove(); window.__clipboardHistoryPanel=null; };
    function render(){
        const list=panel.querySelector('#__ch_list'); list.innerHTML='';
        (history.length?history:[]).slice().reverse().forEach((item,i)=>{
            const el=document.createElement('div'); el.style.cssText='padding:8px;border-radius:6px;margin-bottom:6px;background:#222;border:1px solid #333;display:flex;justify-content:space-between;align-items:center;font-size:13px';
            const txt=document.createElement('div'); txt.style.cssText='flex:1;padding-right:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'; txt.textContent=item;
            const btns=document.createElement('div');
            const copy=document.createElement('button'); copy.textContent='Copy'; copy.style.cssText='margin-left:6px';
            copy.onclick=function(){ navigator.clipboard.writeText(item).then(()=>{ copy.textContent='Copied'; setTimeout(()=>copy.textContent='Copy',900); }); };
            btns.appendChild(copy);
            el.appendChild(txt); el.appendChild(btns); list.appendChild(el);
        });
        if(history.length===0) list.textContent='No entries yet. Copy something to populate this list.';
    }
    render();
    // watch clipboard (user action required to capture) — provide quick button to push current clipboard
    const pushBtn=document.createElement('button'); pushBtn.textContent='Capture current clipboard'; pushBtn.style.cssText='margin-top:8px;padding:8px;border-radius:6px;background:#2b6;color:#fff;border:none;cursor:pointer';
    pushBtn.onclick=function(){
        navigator.clipboard.readText().then(t=>{
            if(!t) return alert('Clipboard empty or unavailable');
            history.push(t); save(history); render();
        }).catch(()=>alert('Clipboard access denied'));
    };
    panel.appendChild(pushBtn);
})();