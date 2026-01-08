document.addEventListener('DOMContentLoaded', function() {
    // transient beta notification about bookmarklets
    (function showBetaNotice(){
        try{
            const id = '__bookmarklet_beta_toast';
            if(document.getElementById(id)) return;
            const toast = document.createElement('div');
            toast.id = id;
            toast.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.25);font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;z-index:999999;opacity:0;transition:opacity .25s';
            toast.innerHTML = '<strong style="display:block;margin-bottom:4px">Bookmarklet Beta</strong><div style="font-size:12px;color:#d0d6db">“Drag to bookmarks” is a beta feature and may not always work. Some features may not function at all. Most useful tools like Draggable Notes and FPS Counter will work from saved bookmarks.</div>';
            const close = document.createElement('button');
            close.textContent = 'OK';
            close.style.cssText = 'margin-left:12px;background:transparent;border:1px solid rgba(255,255,255,.08);color:#fff;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px';
            close.addEventListener('click', ()=>{ toast.style.opacity='0'; setTimeout(()=>toast.remove(),220); localStorage.setItem('__bookmarklet_beta_seen','1'); });
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:8px';
            row.appendChild(document.createElement('div')).remove; // noop to keep structure clear
            toast.appendChild(close);
            document.body.appendChild(toast);
            // show unless dismissed before
            if(!localStorage.getItem('__bookmarklet_beta_seen')){
                requestAnimationFrame(()=>{ toast.style.opacity='1'; });
                // auto-dismiss after 8s
                setTimeout(()=>{ if(document.getElementById(id)){ toast.style.opacity='0'; setTimeout(()=>{ const t=document.getElementById(id); if(t) t.remove(); },220); } },8000);
            } else {
                toast.remove();
            }
        }catch(e){}
    })();

    // Load tool scripts
    const tools = {
        colorPicker: null,
        fontInspector: null,
        layoutDebugger: null,
        imageInfo: null,
        cssEditor: null,
        wordCount: null,
        scrollToTop: null,
        darkModeToggle: null,
        debugGrid: null,
        linkChecker: null,
        headingMap: null,
        cleanPrint: null,
        formFiller: null,
        focusMode: null,
        notePad: null,
        accessibilityChecker: null,
        perfTimings: null,
        elementResizer: null,
        // new tools
        htmlSpeedHack: null,
        fpsCounter: null,
        moduleBrowser: null,
        devTools: null,
        graphCalc: null,
        basicCalculator: null,
        macroCreator: null,
        // added QoL tools
        clipboardHistory: null,
        timer: null,
        paletteGenerator: null,
        loremIpsum: null,
        ruler: null
    };

    // Create bookmarklet links under each button
    document.querySelectorAll('.copy-button').forEach(button => {
        const toolName = button.getAttribute('data-tool');
        const link = document.createElement('a');
        link.className = 'bookmark-link';
        link.textContent = 'Drag to bookmarks';
        link.href = 'javascript:void(0)';
        link.setAttribute('data-tool', toolName);
        button.parentElement.appendChild(link);
    });

    // Search/filter UI
    const searchInput = document.getElementById('tool-search');
    const clearBtn = document.getElementById('clear-search');
    function filterTools() {
        const q = (searchInput.value || '').toLowerCase().trim();
        document.querySelectorAll('.tool-card').forEach(card => {
            const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
            if (!q || title.includes(q) || desc.includes(q)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterTools);
        clearBtn.addEventListener('click', () => { searchInput.value = ''; filterTools(); searchInput.focus(); });
    }

    // Fetch tool scripts
    Object.keys(tools).forEach(toolName => {
        fetch(`./tools/${toolName}.js`)
            .then(response => response.text())
            .then(script => {
                tools[toolName] = script;
                // Update preview
                const preview = document.querySelector(`[data-tool="${toolName}"]`).parentElement.querySelector('.script-preview');
                preview.textContent = script.substring(0, 100) + '...';

                // Update bookmarklet href so it can be dragged to the bookmarks bar
                const bookmarkLink = document.querySelector(`.bookmark-link[data-tool="${toolName}"]`);
                if (bookmarkLink) {
                    // convert script into a single-line bookmarklet-friendly href (collapse whitespace,
                    // ensure it starts with "javascript:" so dragging to bookmarks works reliably)
                    try {
                        let oneLine = (script || '').replace(/\s+/g, ' ').trim();
                        if (oneLine && !oneLine.startsWith('javascript:')) {
                            oneLine = 'javascript:' + oneLine;
                        }
                        bookmarkLink.href = oneLine || 'javascript:void(0)';
                    } catch (e) {
                        bookmarkLink.href = 'javascript:void(0)';
                    }
                    bookmarkLink.title = 'Drag this link to your bookmarks bar';
                    bookmarkLink.textContent = 'Drag to bookmarks';
                }
            })
            .catch(err => console.error(`Failed to load ${toolName}:`, err));
    });

    // Add copy functionality
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function() {
            const toolName = this.getAttribute('data-tool');
            const script = tools[toolName];
            
            if (script) {
                navigator.clipboard.writeText(script).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.background = '#4CAF50';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                    }, 2000);
                }).catch(err => {
                    alert('Failed to copy script. Please copy manually from the preview.');
                });
            }
        });
    });
});