async function exportImage(divId, filename) {
    // 1. Get the specific content we want to capture
    const contentElement = document.getElementById(divId);
    
    // 2. Get the main header (Title + Date)
    const headerElement = document.querySelector('.header-row');

    // 3. Create a temporary container to hold both together
    const tempContainer = document.createElement('div');
    tempContainer.style.background = 'white'; // Ensures no transparency
    tempContainer.style.padding = '20px';
    tempContainer.appendChild(headerElement.cloneNode(true)); // Clone title/date
    tempContainer.appendChild(contentElement.cloneNode(true)); // Clone content

    // 4. Append to body temporarily to measure it
    document.body.appendChild(tempContainer);

    // 5. Capture the temporary container
    const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
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
    const doc = new jsPDF('p', 'pt', 'a4');
    
    // For PDF, we take the same approach to clone the header
    const header = document.querySelector('.header-row').cloneNode(true);
    const content = document.getElementById(divId).cloneNode(true);
    const container = document.createElement('div');
    container.style.background = 'white';
    container.appendChild(header);
    container.appendChild(content);

    doc.html(container, {
        callback: function (doc) { doc.save(`${filename}.pdf`); },
        x: 15, y: 15, width: 560, windowWidth: 1000
    });
}

function shareEmail(divId) {
    const email = prompt("Enter email address to send results to:");
    if (email) alert("Preparing attachment... (EmailJS template required to complete send)");
}