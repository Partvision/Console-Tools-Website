(function(){
    if(window.__basicCalcPanel){
        window.__basicCalcPanel.remove();
        window.__basicCalcPanel=null;
        return;
    }
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;right:20px;top:120px;width:240px;background:#f7f7f8;color:#111;border-radius:8px;padding:8px;z-index:999999;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;box-shadow:0 10px 30px rgba(2,6,23,.2)';
    panel.innerHTML=`
        <div id="__bc_header" style="display:flex;justify-content:space-between;align-items:center;cursor:move;padding:6px 8px;border-radius:6px;">
            <strong style="font-size:13px">Calculator</strong>
            <div style="display:flex;gap:6px">
                <button id="__bc_min" style="background:#ddd;border:none;padding:4px 8px;border-radius:4px;cursor:pointer">–</button>
                <button id="__bc_close" style="background:#e44;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer">×</button>
            </div>
        </div>
        <div id="__bc_body" style="padding:8px;">
            <input id="__bc_display" readonly style="width:100%;height:40px;margin-bottom:8px;padding:6px;font-size:18px;border-radius:6px;border:1px solid #e3e3e3;text-align:right;background:#fff;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
                <button class="__bc_btn" data-val="7">7</button>
                <button class="__bc_btn" data-val="8">8</button>
                <button class="__bc_btn" data-val="9">9</button>
                <button class="__bc_btn" data-val="/" style="background:#f0ad4e">÷</button>

                <button class="__bc_btn" data-val="4">4</button>
                <button class="__bc_btn" data-val="5">5</button>
                <button class="__bc_btn" data-val="6">6</button>
                <button class="__bc_btn" data-val="*" style="background:#f0ad4e">×</button>

                <button class="__bc_btn" data-val="1">1</button>
                <button class="__bc_btn" data-val="2">2</button>
                <button class="__bc_btn" data-val="3">3</button>
                <button class="__bc_btn" data-val="-" style="background:#f0ad4e">−</button>

                <button class="__bc_btn" data-val="0" style="grid-column:span-1">0</button>
                <button class="__bc_btn" data-val="." style="">.</button>
                <button id="__bc_eq" style="background:#2b9d4a;color:#fff;border:none;border-radius:6px;font-size:16px;padding:10px;cursor:pointer">=</button>
                <button class="__bc_btn" data-val="+" style="background:#f0ad4e">+</button>

                <button id="__bc_clear" style="grid-column:span(2);background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:8px;cursor:pointer">C</button>
                <button id="__bc_del" style="grid-column:span(2);background:#bbb;color:#111;border:none;border-radius:6px;padding:8px;cursor:pointer">DEL</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    window.__basicCalcPanel=panel;
    const header=panel.querySelector('#__bc_header');
    const body=panel.querySelector('#__bc_body');
    const display=panel.querySelector('#__bc_display');
    const buttons=[...panel.querySelectorAll('.__bc_btn')];
    const eq=panel.querySelector('#__bc_eq');
    const clearBtn=panel.querySelector('#__bc_clear');
    const delBtn=panel.querySelector('#__bc_del');
    const closeBtn=panel.querySelector('#__bc_close');
    const minBtn=panel.querySelector('#__bc_min');

    let expr='';

    function update(){ display.value = expr || '0'; }

    buttons.forEach(b=>{
        b.style.cssText='padding:10px;border-radius:6px;border:1px solid #e3e3e3;background:#fff;font-size:16px;cursor:pointer';
        b.addEventListener('click', ()=>{
            const v=b.getAttribute('data-val');
            // prevent multiple dots in a number (simple guard)
            if(v === '.' && /(\d+\.\d*)$/.test(expr)) return;
            expr += v;
            update();
        });
    });

    eq.addEventListener('click', compute);
    eq.style.cssText='padding:10px;border-radius:6px;border:1px solid #e3e3e3;cursor:pointer';

    clearBtn.addEventListener('click', ()=>{ expr=''; update(); });
    delBtn.addEventListener('click', ()=>{ expr=expr.slice(0,-1); update(); });

    function safeEval(s){
        try{
            // allow only digits, operators, parentheses, dot, spaces
            if(!/^[0-9+\-*/().\s%]*$/.test(s)) throw new Error('Invalid chars');
            // replace unicode division/multiplication markers if present
            s = s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
            // eval in a safe context
            // eslint-disable-next-line no-new-func
            return Function('"use strict";return ('+s+')')();
        }catch(e){
            return 'Err';
        }
    }

    function compute(){
        if(!expr) return;
        const res = safeEval(expr);
        expr = (res === 'Err' || res === undefined || Number.isNaN(res)) ? '' : String(res);
        display.value = (res === 'Err') ? 'Error' : expr;
    }

    // make draggable
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

    // controls
    closeBtn.addEventListener('click', ()=>{ panel.remove(); window.__basicCalcPanel=null; });
    minBtn.addEventListener('click', ()=>{
        if(body.style.display==='none'){ body.style.display='block'; panel.style.width='240px'; }
        else { body.style.display='none'; panel.style.width='120px'; }
    });

    // keyboard support: numbers, ops, Enter, Backspace, Escape
    function onKey(e){
        if(!window.__basicCalcPanel) return;
        if(e.key.match(/^[0-9+\-*/().%]$/)) { expr += e.key; update(); e.preventDefault(); }
        else if(e.key === 'Enter') { compute(); e.preventDefault(); }
        else if(e.key === 'Backspace') { expr = expr.slice(0,-1); update(); e.preventDefault(); }
        else if(e.key === 'Escape') { panel.remove(); window.__basicCalcPanel=null; document.removeEventListener('keydown', onKey); }
    }
    document.addEventListener('keydown', onKey);
})();