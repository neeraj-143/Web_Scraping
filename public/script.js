// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  // Display user email in navbar
  if (document.getElementById('userEmail')) {
    document.getElementById('userEmail').textContent = user.email;
  }
  
  // Load scraping history
  await loadScrapingHistory();
  
  // Add event listener to scrape button
  const scrapeBtn = document.getElementById('scrapeBtn');
  if (scrapeBtn) {
    scrapeBtn.addEventListener('click', scrapeWebsite);
  }
});

// Save scraped data to Supabase
async function saveScrapedData(scrapedData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('scraped_data')
      .insert([
        {
          user_id: user.id,
          url: scrapedData.url,
          title: scrapedData.title,
          content: scrapedData.content,
          metadata: {
            scraped_at: new Date().toISOString(),
            format: scrapedData.format || 'markdown',
            depth: scrapedData.maxDepth || 1
          }
        }
      ])
      .select();

    if (error) throw error;
    
    console.log('✅ Data saved to Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error saving to Supabase:', error);
    throw error;
  }
}

// Get scraping history
async function getScrapingHistory(limit = 20) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('scraped_data')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    return [];
  }
}

// Delete scraped data
async function deleteScrapedData(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('scraped_data')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    throw error;
  }
}

// Main scrape function
async function scrapeWebsite() {
  const url = document.getElementById('url').value;
  const maxDepth = parseInt(document.getElementById('maxDepth').value) || 1;
  const format = document.getElementById('format').value || 'markdown';
  const resultDiv = document.getElementById('result');
  const scrapeBtn = document.getElementById('scrapeBtn');
  
  if (!url) {
    showNotification('❌ Please enter a URL', 'error');
    return;
  }

  // Show loading state
  resultDiv.innerHTML = '<div class="loading">🔄 Scraping in progress...</div>';
  scrapeBtn.disabled = true;
  scrapeBtn.textContent = 'Scraping...';

  try {
    // Make the scraping request to your backend
    const response = await fetch('/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, maxDepth, format })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const scrapedData = await response.json();
    
    // Display the scraped result
    resultDiv.innerHTML = `
      <div class="success">
        <strong>✅ Scraping Successful!</strong><br><br>
        <strong>URL:</strong> ${scrapedData.url}<br>
        <strong>Title:</strong> ${scrapedData.title || 'N/A'}<br>
        <strong>Format:</strong> ${format}
      </div>
      <pre style="margin-top: 15px; max-height: 400px; overflow-y: auto;">${JSON.stringify(scrapedData, null, 2)}</pre>
    `;
    
    // Save to Supabase
    await saveScrapedData(scrapedData);
    
    // Show success message
    showNotification('✅ Data scraped and saved successfully!', 'success');
    
    // Refresh history
    await loadScrapingHistory();
    
  } catch (error) {
    console.error('Scraping error:', error);
    resultDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
    showNotification('❌ Scraping failed: ' + error.message, 'error');
  } finally {
    scrapeBtn.disabled = false;
    scrapeBtn.textContent = 'Scrape Now';
  }
}

// Load and display scraping history
async function loadScrapingHistory() {
  const historyDiv = document.getElementById('history');
  historyDiv.innerHTML = '<div class="loading">Loading history...</div>';
  
  try {
    const history = await getScrapingHistory(20);
    
    if (history.length === 0) {
      historyDiv.innerHTML = '<p class="no-history">📭 No scraping history yet. Start by scraping a website!</p>';
      return;
    }
    
    historyDiv.innerHTML = `
      <div class="history-list">
        ${history.map(item => `
          <div class="history-item" data-id="${item.id}">
            <div class="history-details">
              <strong>${item.title || 'Untitled'}</strong>
              <small>🔗 ${item.url}</small>
              <small>📅 ${new Date(item.created_at).toLocaleString()}</small>
            </div>
            <div class="history-actions">
              <button class="view-btn" onclick="viewHistoryItem('${item.id}')">👁️ View</button>
              <button class="delete-btn" onclick="deleteHistoryItem('${item.id}')">🗑️ Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    historyDiv.innerHTML = `<div class="error">❌ Error loading history: ${error.message}</div>`;
  }
}

// View a specific history item
async function viewHistoryItem(id) {
  try {
    const { data, error } = await supabase
      .from('scraped_data')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <div class="success">
        <strong>📄 Viewing Saved Scrape</strong><br><br>
        <strong>URL:</strong> ${data.url}<br>
        <strong>Title:</strong> ${data.title || 'N/A'}<br>
        <strong>Date:</strong> ${new Date(data.created_at).toLocaleString()}
      </div>
      <pre style="margin-top: 15px; max-height: 400px; overflow-y: auto;">${JSON.stringify(data, null, 2)}</pre>
    `;
    
    // Scroll to result
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showNotification('❌ Error loading item: ' + error.message, 'error');
  }
}

// Delete a history item
async function deleteHistoryItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }
  
  try {
    await deleteScrapedData(id);
    showNotification('✅ Item deleted successfully', 'success');
    await loadScrapingHistory();
  } catch (error) {
    showNotification('❌ Error deleting item: ' + error.message, 'error');
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}