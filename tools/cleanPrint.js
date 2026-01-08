(function(){
    if(window.cleanPrintStyle){
        window.cleanPrintStyle.remove();
        window.cleanPrintStyle=null;
        return;
    }
    const style=document.createElement('style');
    style.textContent='*{background:none!important;box-shadow:none!important;}header,footer,nav,aside,[role="banner"],[role="navigation"],[role="complementary"],.sidebar,.ads,.advert,.cookie,.newsletter{display:none!important;}body{color:#000!important;font-size:16px;line-height:1.5;}@media print{a:after{content:" (" attr(href) ")";font-size:.8em;color:#555;}}';
    document.head.appendChild(style);
    window.cleanPrintStyle=style;
    alert('Page simplified. Use your browser\\'s print dialog or run the tool again to restore.');
})()