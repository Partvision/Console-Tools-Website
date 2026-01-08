(function(){
    const inputs=[...document.querySelectorAll('input[type="text"],input[type="email"],input[type="search"],input[type="url"],input[type="tel"],textarea')];
    if(!inputs.length){alert('No text inputs or textareas found');return;}
    const sampleText='Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    inputs.forEach(el=>{
        const type=(el.getAttribute('type')||'text').toLowerCase();
        if(type==='email')el.value='test@example.com';
        else if(type==='url')el.value='https://example.com';
        else if(type==='tel')el.value='+1 555 123 4567';
        else el.value=sampleText;
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
    });
    alert('Filled '+inputs.length+' fields with sample data.');
})()