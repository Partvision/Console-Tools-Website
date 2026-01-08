(function(){
    if(window.darkModeToggleStyle){
        window.darkModeToggleStyle.remove();
        window.darkModeToggleStyle=null;
        return;
    }
    const style=document.createElement('style');
    style.textContent='html{background:#000!important;color:#eee!important}img,video,canvas{filter:brightness(.8) contrast(1.1)}body,*{background-color:transparent!important;border-color:#555!important;color:inherit!important}';
    document.head.appendChild(style);
    window.darkModeToggleStyle=style;
})()