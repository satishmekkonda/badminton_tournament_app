async function exportImage(divId, filename) {
    // 1. Get the specific content we want to capture
    const contentElement = document.getElementById(divId);
    
    // 2. Get the main header (Title + Date)
    const headerElement = document.querySelector('.header-row');

    // 3. Create a temporary container to hold both together
    const tempContainer = document.createElement('div');
    tempContainer.style.background = 'white'; 
    tempContainer.style.padding = '20px';
    tempContainer.style.width = '800px'; // Set a fixed width for consistent rendering
    
    const clonedHeader = headerElement.cloneNode(true);
    const clonedContent = contentElement.cloneNode(true);

    // --- FIX FOR PLAYOFF INPUTS ---
    // We find all inputs in the cloned content and replace them with text spans
    const inputs = clonedContent.querySelectorAll('input[type="number"]');
    inputs.forEach(inp => {
        const val = inp.value || "0";
        const span = document.createElement('span');
        span.innerText = val;
        span.style.fontWeight = 'bold';
        span.style.display = 'inline-block';
        span.style.width = '50px';
        span.style.textAlign = 'center';
        // Replace the input with the span
        inp.parentNode.replaceChild(span, inp);
    });

    tempContainer.appendChild(clonedHeader);
    tempContainer.appendChild(clonedContent);

    // 4. Append to body temporarily to measure it
    document.body.appendChild(tempContainer);

    // 5. Capture the temporary container
    const canvas = await html2canvas(tempContainer, {
        scale: 2, 
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
    });

    // 6. Remove temporary container
    document.body.removeChild(tempContainer);

    const data = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = data;
    link.download = `${filename}.png`;
    link.click();
}

function exportPDF(divId, filename) {
    const { jsPDF } = window.jspdf;
    
    // Create clones
    const header = document.querySelector('.header-row').cloneNode(true);
    const content = document.getElementById(divId).cloneNode(true);
    
    // --- FIX FOR PLAYOFF INPUTS ---
    const inputs = content.querySelectorAll('input[type="number"]');
    inputs.forEach(inp => {
        const val = inp.value || "0";
        const span = document.createElement('span');
        span.innerText = val;
        span.style.fontWeight = 'bold';
        span.style.display = 'inline-block';
        span.style.width = '50px';
        span.style.textAlign = 'center';
        inp.parentNode.replaceChild(span, inp);
    });

    const container = document.createElement('div');
    container.style.background = 'white';
    container.style.width = '800px';
    container.style.padding = '20px';
    container.appendChild(header);
    container.appendChild(content);

    // Using html2canvas + jsPDF approach for better styling consistency
    html2canvas(container, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
    });
}

function shareEmail(divId) {
    const email = prompt("Enter email address to send results to:");
    if (email) {
        alert("Preparing attachment... To enable this, you need to set up an EmailJS service and template.");
        // This is where we would trigger the email logic tomorrow if needed
    }
}