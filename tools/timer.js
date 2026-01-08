(function(){
    if(window.__timerPanel){
        window.__timerPanel.remove();
        window.__timerPanel=null;
        return;
    }
    const panel=document.createElement('div');
    panel.style.cssText='position:fixed;right:20px;bottom:20px;width:220px;background:#072a3b;color:#fff;border-radius:8px;padding:10px;z-index:999999;font-family:monospace;';
    panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Timer</strong><button id="__t_close">×</button></div><div style="display:flex;gap:6px;margin-bottom:8px;"><input id="__t_input" placeholder="seconds or mm:ss" style="flex:1;padding:6px;border-radius:6px;border:1px solid #034;color:inherit;background:#013"></div><div style="display:flex;gap:6px;"><button id="__t_start" style="flex:1;padding:8px;border-radius:6px;background:#2b6;border:none;cursor:pointer">Start</button><button id="__t_stop" style="flex:1;padding:8px;border-radius:6px;background:#e44;border:none;cursor:pointer">Stop</button></div><div id="__t_display" style="margin-top:8px;text-align:center;font-size:16px"></div>';
    document.body.appendChild(panel);
    window.__timerPanel=panel;
    panel.querySelector('#__t_close').onclick=function(){ panel.remove(); window.__timerPanel=null; clearInterval(window.__timerInterval); };
    const input=panel.querySelector('#__t_input'), display=panel.querySelector('#__t_display');
    let remaining=0; window.__timerInterval=null;
    function parse(v){
        if(v.includes(':')){ const parts=v.split(':').map(Number); return (parts[0]*60)+(parts[1]||0); }
        return Number(v)||0;
    }
    function tick(){
        if(remaining<=0){ clearInterval(window.__timerInterval); window.__timerInterval=null; display.textContent='Done!'; try{ new Notification && Notification.requestPermission().then(()=>{ new Notification('Timer finished'); }); }catch(e){} return; }
        remaining--; display.textContent = Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');
    }
    panel.querySelector('#__t_start').onclick=function(){
        if(window.__timerInterval) clearInterval(window.__timerInterval);
        remaining = parse(input.value||'1500');
        display.textContent = Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');
        window.__timerInterval = setInterval(tick,1000);
    };
    panel.querySelector('#__t_stop').onclick=function(){ if(window.__timerInterval) clearInterval(window.__timerInterval); window.__timerInterval=null; display.textContent='Stopped'; };
})();