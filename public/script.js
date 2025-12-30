document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const url = document.getElementById('url').value;
    const maxPages = document.getElementById('maxPages').value;
    const extractionType = document.getElementById('extractionType').value;
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.textContent = 'Loading...';
    
    try {
        const response = await fetch('/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, maxPages, extractionType })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultsDiv.textContent = JSON.stringify(data.data, null, 2);
        } else {
            resultsDiv.textContent = 'Error: ' + data.error;
        }
    } catch (error) {
        resultsDiv.textContent = 'Error: ' + error.message;
    }
});