async function exportImage(divId, filename) {
    const contentElement = document.getElementById(divId);
    const headerElement = document.querySelector('.header-row');

    const tempContainer = document.createElement('div');
    tempContainer.style.background = 'white'; 
    tempContainer.style.padding = '30px';
    tempContainer.style.width = '850px'; // Slightly wider for better table fit
    
    const clonedHeader = headerElement.cloneNode(true);
    const clonedContent = contentElement.cloneNode(true);

    // --- FIX FOR PLAYOFF ALIGNMENT ---
    // 1. Target the flex containers in the playoff cards
    const playoffRows = clonedContent.querySelectorAll('.playoff-match-card > div');
    playoffRows.forEach(row => {
        row.style.display = 'flex';
        row.style.flexDirection = 'row';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'center';
        row.style.gap = '10px';
        row.style.width = '100%';
    });

    // 2. Replace inputs with perfectly sized spans
    const inputs = clonedContent.querySelectorAll('input[type="number"]');
    inputs.forEach(inp => {
        const val = inp.value || "0";
        const span = document.createElement('span');
        span.innerText = val;
        // Visual styles to match the original box size but as static text
        span.style.fontWeight = 'bold';
        span.style.display = 'inline-block';
        span.style.width = '50px';
        span.style.height = '30px';
        span.style.lineHeight = '30px'; // Vertically centers text in the 30px height
        span.style.textAlign = 'center';
        span.style.border = '1px solid #cbd5e1';
        span.style.borderRadius = '4px';
        inp.parentNode.replaceChild(span, inp);
    });

    // 3. Ensure the hyphen and names stay on the same baseline
    const allSpans = clonedContent.querySelectorAll('.playoff-match-card span');
    allSpans.forEach(s => {
        s.style.display = 'inline-block';
        s.style.verticalAlign = 'middle';
        s.style.lineHeight = '30px'; 
    });

    tempContainer.appendChild(clonedHeader);
    tempContainer.appendChild(clonedContent);
    document.body.appendChild(tempContainer);

    const canvas = await html2canvas(tempContainer, {
        scale: 2, 
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
    });

    document.body.removeChild(tempContainer);

    // --- UPDATED: MOBILE PREVIEW FOR LONG-PRESS SAVING ---
    const data = canvas.toDataURL("image/png");

    const overlay = document.createElement('div');
    overlay.id = 'image-preview-overlay';
    overlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 10000;
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; padding: 20px; box-sizing: border-box;
    `;

    overlay.innerHTML = `
        <div style="background: white; padding: 15px; border-radius: 12px; text-align: center; max-width: 95%;">
            <p style="color: #333; font-weight: bold; margin-bottom: 10px; font-family: sans-serif; font-size: 14px;">
                Mobile: Hold image to "Save to Photos"<br>
                Desktop: Right-click to "Save Image As"
            </p>
            
            <img src="${data}" style="max-width: 100%; max-height: 60vh; border: 1px solid #ddd; border-radius: 4px;">
            
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <a href="${data}" download="${filename}.png" 
                   style="flex: 1; text-decoration: none; background: #16a34a; color: white; padding: 12px; border-radius: 8px; font-weight: bold; font-size: 14px; font-family: sans-serif;">
                   Download File
                </a>
                
                <button onclick="document.getElementById('image-preview-overlay').remove()" 
                        style="flex: 1; padding: 12px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}

function exportPDF(divId, filename) {
    const { jsPDF } = window.jspdf;
    
    // We use the image export logic for the PDF to ensure alignment is identical
    const contentElement = document.getElementById(divId);
    const headerElement = document.querySelector('.header-row');
    const tempContainer = document.createElement('div');
    tempContainer.style.background = 'white';
    tempContainer.style.width = '850px';
    tempContainer.style.padding = '30px';

    const clonedHeader = headerElement.cloneNode(true);
    const clonedContent = contentElement.cloneNode(true);

    // Re-apply the same alignment fix as the image export
    const inputs = clonedContent.querySelectorAll('input[type="number"]');
    inputs.forEach(inp => {
        const span = document.createElement('span');
        span.innerText = inp.value || "0";
        span.style.cssText = "font-weight:bold; display:inline-block; width:50px; height:30px; line-height:30px; text-align:center; border:1px solid #cbd5e1; border-radius:4px; vertical-align:middle;";
        inp.parentNode.replaceChild(span, inp);
    });

    tempContainer.appendChild(clonedHeader);
    tempContainer.appendChild(clonedContent);

    html2canvas(tempContainer, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
    });
}

function shareEmail(divId) {
    const email = prompt("Enter email address to send results to:");
    if (email) alert("Preparing attachment... (Requires EmailJS Setup)");
}