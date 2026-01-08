(function(){
    if(window.__graphCalcPanel){
        window.__graphCalcPanel.remove();
        window.__graphCalcPanel=null;
        return;
    }
    // panel
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;right:20px;top:80px;width:520px;background:#0f1720;color:#e6eef8;border-radius:8px;padding:8px;z-index:999999;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;box-shadow:0 10px 30px rgba(2,6,23,.6);max-width:96vw';
    panel.innerHTML=`
        <div id="__gc_header" style="display:flex;justify-content:space-between;align-items:center;cursor:move;padding:6px 8px;border-radius:6px;">
            <strong style="font-size:13px">Graphing Calculator</strong>
            <div style="display:flex;gap:6px">
                <button id="__gc_export" title="Export PNG" style="background:#256;background:#234;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer">⇩</button>
                <button id="__gc_min" style="background:#234;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer">–</button>
                <button id="__gc_close" style="background:#b33;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer">×</button>
            </div>
        </div>
        <div id="__gc_body" style="padding:8px;">
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap">
                <input id="__gc_expr" placeholder="y = sin(x); cos(x)*0.5; x*x - 2" style="flex:1;padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:inherit;font-family:monospace;font-size:13px">
                <select id="__gc_range" style="padding:8px;border-radius:6px;background:rgba(255,255,255,.02);color:inherit;border:1px solid rgba(255,255,255,.06)">
                    <option value="10">±10</option>
                    <option value="5">±5</option>
                    <option value="2">±2</option>
                    <option value="1">±1</option>
                </select>
                <button id="__gc_plot" style="padding:8px 10px;border-radius:6px;border:none;background:#1f9d55;color:#fff;cursor:pointer">Plot</button>
            </div>
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                <label style="font-size:12px;color:rgba(230,238,248,.7)">Colors (comma):</label>
                <input id="__gc_colors" placeholder="#2ee6a9,#ff9f43,#9f7cff" style="flex:1;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);font-family:monospace;color:inherit;font-size:13px">
                <label style="font-size:12px;color:rgba(230,238,248,.7)">Samples:</label>
                <input id="__gc_samples" type="number" min="100" max="2000" value="600" style="width:80px;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:inherit;font-size:13px">
            </div>
            <canvas id="__gc_canvas" width="480" height="260" style="width:100%;height:260px;border-radius:6px;background:#071018;display:block"></canvas>
            <div style="margin-top:6px;color:rgba(230,238,248,.7);font-size:12px;display:flex;justify-content:space-between;align-items:center">
                <div>Tip: multiple functions separated by ; — support Math.* or shorthand sin(x)</div>
                <div style="font-size:12px;color:#9aa">Mouse wheel to zoom • Drag to pan • Double-click to reset</div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    window.__graphCalcPanel=panel;

    const header = panel.querySelector('#__gc_header');
    const body = panel.querySelector('#__gc_body');
    const exprInput = panel.querySelector('#__gc_expr');
    const plotBtn = panel.querySelector('#__gc_plot');
    const closeBtn = panel.querySelector('#__gc_close');
    const minBtn = panel.querySelector('#__gc_min');
    const exportBtn = panel.querySelector('#__gc_export');
    const canvas = panel.querySelector('#__gc_canvas');
    const ctx = canvas.getContext('2d');

    // reactive state
    let state = {
        range: 10,
        offsetX: 0, // pan in logical units
        offsetY: 0,
        samples: 600,
        colors: ['#2ee6a9','#ff9f43','#9f7cff']
    };

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

    // safe evaluator that supports shorthand like sin(x)
    function makeFn(expr){
        if(!expr) return null;
        // replace common funcs with Math.
        const safe = expr.replace(/\b(sin|cos|tan|abs|sqrt|log|exp|pow|floor|ceil|round|min|max|atan2|atan|asin|acos)\b/g,'Math.$1');
        try{
            // limit to single param x
            return new Function('x','with(Math){return ('+safe+');}');
        }catch(e){
            return null;
        }
    }

    // adaptive canvas sizing
    function resizeCanvas(){
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(200, Math.floor(rect.width * dpr));
        canvas.height = Math.max(120, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    // draw background, grid, axes, ticks
    function drawGrid(range){
        const r = range;
        const w = canvas.width/(window.devicePixelRatio||1);
        const h = canvas.height/(window.devicePixelRatio||1);
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle='#071018';
        ctx.fillRect(0,0,w,h);
        // compute scale: pixels per unit
        const pxPerUnit = (w/2)/r;
        const cx = w/2 + state.offsetX * pxPerUnit;
        const cy = h/2 - state.offsetY * pxPerUnit;
        // light grid lines
        ctx.strokeStyle='rgba(200,220,240,0.06)';
        ctx.lineWidth=1;
        const gridUnit = chooseGridUnit(r);
        for(let x = Math.floor((-cx)/(pxPerUnit*gridUnit))*gridUnit; x < (w-cx)/(pxPerUnit); x += gridUnit){
            const gx = cx + x*pxPerUnit;
            ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,h); ctx.stroke();
        }
        for(let y = Math.floor((-cy)/(pxPerUnit*gridUnit))*gridUnit; y < (h-cy)/(pxPerUnit); y += gridUnit){
            const gy = cy + y*pxPerUnit;
            ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke();
        }
        // axes
        ctx.strokeStyle='rgba(200,220,240,0.18)';
        ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(w,cy); ctx.moveTo(cx,0); ctx.lineTo(cx,h); ctx.stroke();
        // ticks + labels
        ctx.fillStyle='rgba(230,238,248,0.7)';
        ctx.font='11px monospace';
        ctx.textAlign='left';
        ctx.textBaseline='top';
        for(let i=-5;i<=5;i++){
            const tx = cx + i*gridUnit*pxPerUnit;
            if(tx<0||tx>w) continue;
            ctx.fillText(((-state.offsetX)+i*gridUnit).toFixed(2).replace(/\.00$/,''), tx+4, cy+4);
        }
    }

    function chooseGridUnit(range){
        // choose a nice grid step based on range
        const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
        const norm = range / magnitude;
        if(norm <= 1.5) return magnitude/5;
        if(norm <= 3) return magnitude/2;
        if(norm <= 7) return magnitude;
        return magnitude*2;
    }

    function plotExpressionList(expressions, rangeVal){
        resizeCanvas();
        const w = canvas.width/(window.devicePixelRatio||1);
        const h = canvas.height/(window.devicePixelRatio||1);
        drawGrid(rangeVal);
        const pxPerUnit = (w/2)/rangeVal;
        const cx = w/2 + state.offsetX * pxPerUnit;
        const cy = h/2 - state.offsetY * pxPerUnit;
        const samples = Math.min(2000, Math.max(100, state.samples));
        expressions.forEach((expr, idx) => {
            const fn = makeFn(expr);
            if(!fn) return;
            const color = (state.colors[idx] || state.colors[idx%state.colors.length] || '#2ee6a9');
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            let moved=false;
            for(let i=0;i<samples;i++){
                const t = i/(samples-1);
                const x = -rangeVal + t*(2*rangeVal);
                let y;
                try{ y = fn(x); }catch(e){ y = NaN; }
                if(typeof y !== 'number' || !isFinite(y)) { moved=false; continue; }
                const sx = cx + x*pxPerUnit;
                const sy = cy - y*pxPerUnit;
                if(!moved){ ctx.moveTo(sx,sy); moved=true; } else { ctx.lineTo(sx,sy); }
            }
            ctx.stroke();
        });
    }

    // handle input parsing (split ; )
    function getExpressions(raw){
        return raw.split(';').map(s=>s.trim()).filter(s=>s.length>0).map(s=>{
            // remove leading "y=" if present
            return s.replace(/^\s*y\s*=\s*/i,'');
        });
    }

    // events: plot
    plotBtn.addEventListener('click', function(){
        const raw = exprInput.value.trim();
        if(!raw) return alert('Enter expression(s) for y in terms of x');
        state.range = parseFloat(panel.querySelector('#__gc_range').value)||10;
        state.samples = parseInt(panel.querySelector('#__gc_samples').value)||600;
        const colorsRaw = panel.querySelector('#__gc_colors').value.trim();
        state.colors = colorsRaw ? colorsRaw.split(',').map(s=>s.trim()).filter(Boolean) : state.colors;
        const exprs = getExpressions(raw);
        plotExpressionList(exprs, state.range);
    });

    exprInput.addEventListener('keydown', function(e){
        if(e.key==='Enter' && (e.ctrlKey||e.metaKey)) { e.preventDefault(); plotBtn.click(); }
        else if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); plotBtn.click(); }
    });

    // canvas interactions: pan, zoom, double-click reset
    let isPanning=false, panStart={x:0,y:0}, panOffsetStart={x:0,y:0};
    canvas.addEventListener('mousedown', function(e){
        if(e.button!==0) return;
        isPanning=true;
        panStart={x:e.clientX,y:e.clientY};
        panOffsetStart={x:state.offsetX,y:state.offsetY};
        canvas.style.cursor='grabbing';
    });
    window.addEventListener('mousemove', function(e){
        if(!isPanning) return;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const pxPerUnit = (w/2)/state.range;
        const dx = (e.clientX - panStart.x)/pxPerUnit;
        const dy = (e.clientY - panStart.y)/pxPerUnit;
        state.offsetX = panOffsetStart.x + dx;
        state.offsetY = panOffsetStart.y - dy;
        // redraw current exprs
        const exprs = getExpressions(exprInput.value || '');
        plotExpressionList(exprs, state.range);
    });
    window.addEventListener('mouseup', function(e){
        if(isPanning){ isPanning=false; canvas.style.cursor='crosshair'; }
    });
    canvas.addEventListener('wheel', function(e){
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1.12 : 0.88;
        const prevRange = state.range;
        state.range = Math.max(0.1, Math.min(1000, state.range * delta));
        // zoom towards pointer: adjust offsets so point under cursor stays similar
        const rect = canvas.getBoundingClientRect();
        const cx = rect.width/2 + state.offsetX*(rect.width/2)/prevRange;
        const cy = rect.height/2 - state.offsetY*(rect.width/2)/prevRange;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const ratioX = (mouseX - rect.width/2) / (rect.width/2);
        const ratioY = (rect.height/2 - mouseY) / (rect.width/2);
        state.offsetX += ratioX*(1/prevRange - 1/state.range);
        state.offsetY += ratioY*(1/prevRange - 1/state.range);
        const exprs = getExpressions(exprInput.value || '');
        plotExpressionList(exprs, state.range);
    },{passive:false});
    canvas.addEventListener('dblclick', function(){
        state.range = parseFloat(panel.querySelector('#__gc_range').value)||10;
        state.offsetX = 0; state.offsetY = 0;
        const exprs = getExpressions(exprInput.value || '');
        plotExpressionList(exprs, state.range);
    });

    // auto-resize observer
    const ro = new ResizeObserver(()=>{ const exprs=getExpressions(exprInput.value||''); plotExpressionList(exprs,state.range); });
    ro.observe(canvas);

    // controls: close, minimize, export
    closeBtn.addEventListener('click', function(){ panel.remove(); window.__graphCalcPanel=null; ro.disconnect(); });
    minBtn.addEventListener('click', function(){ if(body.style.display==='none'){ body.style.display='block'; panel.style.width='520px'; } else { body.style.display='none'; panel.style.width='220px'; } });
    exportBtn.addEventListener('click', function(){
        // produce a PNG from canvas
        const data = canvas.toDataURL('image/png');
        const a = document.createElement('a'); a.href = data; a.download = 'graph.png'; a.click();
    });

    // initial sample
    exprInput.value='sin(x)';
    panel.querySelector('#__gc_colors').value = '#2ee6a9,#ff9f43';
    panel.querySelector('#__gc_samples').value = '600';
    plotBtn.click();

    // keyboard escape closes
    document.addEventListener('keydown', function onKey(e){
        if(e.key==='Escape'){
            document.removeEventListener('keydown',onKey);
            if(window.__graphCalcPanel){ window.__graphCalcPanel.remove(); window.__graphCalcPanel=null; ro.disconnect(); }
        }
    });
})();