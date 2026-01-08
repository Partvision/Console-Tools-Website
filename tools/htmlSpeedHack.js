(function(){
    if(window.__htmlSpeedHackActive){
        if(window.__htmlSpeedHackStyle){window.__htmlSpeedHackStyle.remove();window.__htmlSpeedHackStyle=null;}
        document.querySelectorAll('video').forEach(v=>{v.playbackRate=1;});
        window.__htmlSpeedHackActive=false;
        alert('HTML Speedhack disabled');
        return;
    }
    window.__htmlSpeedHackActive=true;
    const style=document.createElement('style');
    style.id='__html_speedhack_style';
    style.textContent='*{transition-duration:0s !important;animation-duration:0.001s !important;animation-delay:0s !important;scroll-behavior:auto !important;}';
    document.head.appendChild(style);
    window.__htmlSpeedHackStyle=style;
    // speed up videos
    document.querySelectorAll('video').forEach(v=>{try{v.playbackRate=2;}catch(e){}});
    alert('HTML Speedhack enabled: animations/transitions minimized; videos set to 2x (run again to restore).');
})();