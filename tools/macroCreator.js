(function(){
    if(window.__macroCreatorPanel){
        window.__macroCreatorPanel.remove();
        window.__macroCreatorPanel=null;
        return;
    }

    const STORAGE_KEY = '__gui_macros_v1';
    function load() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e){ return []; }
    }
    function save(arr){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }catch(e){} }

    let recording=false;
    let currentActions=[];
    const saved = load();

    const panel = document.createElement('div');
    panel.style.cssText='position:fixed;right:20px;top:80px;width:360px;background:#0b1220;color:#e6eef8;border-radius:8px;padding:8px;z-index:999999;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;box-shadow:0 10px 30px rgba(2,6,23,.6);max-width:96vw';
    panel.innerHTML = `
        <div id="__mc_header" style="display:flex;justify-content:space-between;align-items:center;cursor:move;padding:6px 8px;border-radius:6px;">
            <strong style="font-size:13px">GUI Macro Creator</strong>
            <div style="display:flex;gap:6px">
                <button id="__mc_export" title="Export selected macro" style="background:#234;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer">Export</button>
                <button id="__mc_close" style="background:#b33;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer">×</button>
            </div>
        </div>
        <div id="__mc_body" style="padding:8px;">
            <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
                <button id="__mc_rec" style="flex:1;padding:8px;border-radius:6px;border:none;background:#d9534f;color:#fff;cursor:pointer">Record</button>
                <button id="__mc_play" style="padding:8px;border-radius:6px;border:none;background:#2b9d4a;color:#fff;cursor:pointer">Play</button>
            </div>
            <div style="margin-bottom:8px;font-size:12px;color:#9aa">Recorded actions capture simple clicks and typing in sequence. Use Save to keep macros per site.</div>
            <div style="display:flex;gap:8px;margin-bottom:8px;">
                <input id="__mc_name" placeholder="Macro name" style="flex:1;padding:6px;border-radius:6px;border:1px solid rgba(230,238,248,.06);background:transparent;color:inherit;font-family:monospace">
                <button id="__mc_save" style="padding:6px;border-radius:6px;border:none;background:#2b6;color:#fff;cursor:pointer">Save</button>
            </div>
            <div style="max-height:160px;overflow:auto;border-radius:6px;padding:6px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.03);">
                <div id="__mc_list"></div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    window.__macroCreatorPanel = panel;

    const header = panel.querySelector('#__mc_header');
    const recBtn = panel.querySelector('#__mc_rec');
    const playBtn = panel.querySelector('#__mc_play');
    const saveBtn = panel.querySelector('#__mc_save');
    const nameInput = panel.querySelector('#__mc_name');
    const listEl = panel.querySelector('#__mc_list');
    const closeBtn = panel.querySelector('#__mc_close');
    const exportBtn = panel.querySelector('#__mc_export');

    function renderList(){
        listEl.innerHTML = '';
        (saved || []).forEach((m,i)=>{
            const row = document.createElement('div');
            row.style.cssText='display:flex;gap:8px;align-items:center;padding:6px;border-radius:6px;margin-bottom:6px;background:rgba(255,255,255,0.02)';
            const title = document.createElement('div'); title.textContent = m.name || ('Macro '+(i+1)); title.style.cssText='flex:1;font-size:13px';
            const run = document.createElement('button'); run.textContent='Run'; run.style.cssText='padding:6px;border-radius:6px;background:#2b6;color:#fff;border:none;cursor:pointer';
            const del = document.createElement('button'); del.textContent='Del'; del.style.cssText='padding:6px;border-radius:6px;background:#b33;color:#fff;border:none;cursor:pointer';
            const ex = document.createElement('button'); ex.textContent='→'; ex.style.cssText='padding:6px;border-radius:6px;background:#444;color:#fff;border:none;cursor:pointer';
            run.onclick = ()=>{ playSequence(m.actions); };
            del.onclick = ()=>{ saved.splice(i,1); save(saved); renderList(); };
            ex.onclick = ()=>{ prompt('Macro as JSON (copy):', JSON.stringify(m)); };
            row.appendChild(title); row.appendChild(run); row.appendChild(ex); row.appendChild(del);
            listEl.appendChild(row);
        });
        if((saved||[]).length===0) listEl.textContent = 'No saved macros yet.';
    }

    function recordStart(){
        if(recording) return;
        recording=true;
        currentActions = [];
        recBtn.textContent='Stop';
        recBtn.style.background='#666';
        enableCapture();
        alert('Recording started: clicks and typing will be recorded. Press Stop to finish.');
    }
    function recordStop(){
        recording=false;
        recBtn.textContent='Record';
        recBtn.style.background='#d9534f';
        disableCapture();
        alert('Recording stopped. Save or Play the sequence.');
    }

    // capture events: clicks (selector + offset) and input events (selector, value)
    function makeSelectorPath(el){
        if(!el) return null;
        // try ID first
        if(el.id) return {type:'id',val:el.id};
        // fallback to tag + nth-child
        const path = [];
        let cur = el;
        while(cur && cur.nodeType===1 && cur !== document.body){
            const tag = cur.tagName.toLowerCase();
            let idx = 1;
            let sib = cur.previousElementSibling;
            while(sib){ if(sib.tagName===cur.tagName) idx++; sib = sib.previousElementSibling; }
            path.unshift(tag + (idx>1?':nth-of-type('+idx+')':'')); 
            cur = cur.parentElement;
        }
        return {type:'path',val:path.join('>')};
    }
    function resolveSelector(sel){
        try{
            if(sel.type==='id') return document.getElementById(sel.val);
            return document.querySelector(sel.val);
        }catch(e){ return null; }
    }

    function enableCapture(){
        document.addEventListener('click', onDocClick, true);
        document.addEventListener('input', onDocInput, true);
        document.addEventListener('keydown', onDocKey, true);
    }
    function disableCapture(){
        document.removeEventListener('click', onDocClick, true);
        document.removeEventListener('input', onDocInput, true);
        document.removeEventListener('keydown', onDocKey, true);
    }

    function onDocClick(e){
        if(!recording) return;
        // avoid recording actions inside our panel
        if(panel.contains(e.target)) return;
        e.stopPropagation(); e.preventDefault();
        const sel = makeSelectorPath(e.target);
        currentActions.push({type:'click',selector:sel,button:e.button,time:Date.now()});
        flash(e.target);
    }
    function onDocInput(e){
        if(!recording) return;
        if(panel.contains(e.target)) return;
        const sel = makeSelectorPath(e.target);
        currentActions.push({type:'input',selector:sel,value:e.target.value,time:Date.now()});
    }
    function onDocKey(e){
        if(!recording) return;
        if(panel.contains(e.target)) return;
        // capture Enter to mark form submits lightly
        if(e.key === 'Enter'){
            const sel = makeSelectorPath(document.activeElement);
            currentActions.push({type:'key',selector:sel,key:'Enter',time:Date.now()});
        }
    }

    function flash(el){
        try{
            const old = el.style.boxShadow;
            el.style.boxShadow = '0 0 0 3px rgba(46,230,169,0.35)';
            setTimeout(()=>el.style.boxShadow = old, 400);
        }catch(e){}
    }

    // play sequence: resolve selectors, replay with timing ratios
    async function playSequence(actions){
        if(!actions || !actions.length) return;
        const start = actions[0].time || Date.now();
        for(let i=0;i<actions.length;i++){
            const a = actions[i];
            const delay = Math.max(0, (a.time || start) - (i?actions[i-1].time:start));
            await new Promise(r=>setTimeout(r, delay));
            const el = resolveSelector(a.selector);
            if(!el) continue;
            try{
                if(a.type==='click'){
                    flash(el);
                    el.click();
                }else if(a.type==='input'){
                    el.focus();
                    el.value = a.value;
                    el.dispatchEvent(new Event('input',{bubbles:true}));
                    el.dispatchEvent(new Event('change',{bubbles:true}));
                }else if(a.type==='key'){
                    el.dispatchEvent(new KeyboardEvent('keydown',{key:a.key}));
                    el.dispatchEvent(new KeyboardEvent('keyup',{key:a.key}));
                }
            }catch(e){}
        }
    }

    // wire UI
    recBtn.addEventListener('click', function(){
        if(!recording) recordStart(); else recordStop();
    });
    playBtn.addEventListener('click', function(){
        if(recording) { recordStop(); }
        if(currentActions.length) playSequence(currentActions);
        else alert('No recorded actions to play.');
    });
    saveBtn.addEventListener('click', function(){
        const name = (nameInput.value||'Macro '+(saved.length+1)).trim();
        if(!currentActions.length){ alert('Nothing recorded to save'); return; }
        saved.push({name: name, actions: currentActions.slice()});
        save(saved);
        renderList();
        nameInput.value='';
        alert('Macro saved.');
    });

    exportBtn.addEventListener('click', function(){
        const first = saved[0];
        if(!first){ alert('No macros saved to export'); return; }
        const js = 'javascript:(function(){const actions='+encodeURIComponent(JSON.stringify(first.actions))+';function r(s){try{return document.getElementById(s)}catch(e){}return document.querySelector(s)};const seq=JSON.parse(decodeURIComponent(actions));(async function(){for(let a of seq){await new Promise(r=>setTimeout(r, a.time?100:50));const el = (a.selector.type==='id')?document.getElementById(a.selector.val):document.querySelector(a.selector.val); if(!el) continue; if(a.type==='click') el.click(); else if(a.type==='input'){ el.value=a.value; el.dispatchEvent(new Event(\"input\",{bubbles:true})); el.dispatchEvent(new Event(\"change\",{bubbles:true})); } }})();})();';
        prompt('Copy this bookmarklet and save as a bookmark URL:', js);
    });

    closeBtn.addEventListener('click', function(){ panel.remove(); window.__macroCreatorPanel=null; disableCapture(); });

    // draggable
    (function makeDraggable(el,handle){
        let isDown=false,startX,startY,startLeft,startTop;
        (handle||el).addEventListener('mousedown',function(e){
            if(e.button!==0) return;
            isDown=true;
            const rect=el.getBoundingClientRect();
            startX=e.clientX; startY=e.clientY;
            startLeft=rect.left; startTop=rect.top;
            el.style.left=startLeft+'px'; el.style.top=startTop+'px'; el.style.right='auto';
            e.preventDefault();
        });
        document.addEventListener('mousemove',function(e){
            if(!isDown) return;
            const dx=e.clientX-startX, dy=e.clientY-startY;
            el.style.left = (startLeft+dx) + 'px';
            el.style.top = (startTop+dy) + 'px';
        });
        document.addEventListener('mouseup',function(){ isDown=false; });
    })(panel, header);

    // init render
    renderList();

    // cleanup on escape
    document.addEventListener('keydown', function onKey(e){
        if(e.key==='Escape'){ document.removeEventListener('keydown', onKey); if(window.__macroCreatorPanel){ window.__macroCreatorPanel.remove(); window.__macroCreatorPanel=null; disableCapture(); } }
    });
})();