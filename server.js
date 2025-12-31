const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService();

// Store visited URLs to avoid infinite loops
const visitedUrls = new Set();

// Scraping function
async function scrapeUrl(url, maxDepth = 1, currentDepth = 0, format = 'markdown') {
  if (currentDepth >= maxDepth || visitedUrls.has(url)) {
    return null;
  }

  visitedUrls.add(url);

  try {
    console.log(`Scraping: ${url} (Depth: ${currentDepth})`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();

    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'No Title';

    // Extract main content
    let content = '';
    
    if (format === 'markdown') {
      // Get body content and convert to markdown
      const bodyHtml = $('body').html() || '';
      content = turndownService.turndown(bodyHtml);
    } else if (format === 'json') {
      // Extract structured data
      content = JSON.stringify({
        title: title,
        headings: $('h1, h2, h3').map((i, el) => $(el).text().trim()).get(),
        paragraphs: $('p').map((i, el) => $(el).text().trim()).get().filter(p => p.length > 0),
        links: $('a[href]').map((i, el) => ({
          text: $(el).text().trim(),
          href: $(el).attr('href')
        })).get(),
        images: $('img[src]').map((i, el) => ({
          alt: $(el).attr('alt') || '',
          src: $(el).attr('src')
        })).get()
      }, null, 2);
    } else if (format === 'html') {
      // Return cleaned HTML
      content = $('body').html() || '';
    }

    // Extract links for deeper crawling
    const links = [];
    if (currentDepth < maxDepth - 1) {
      $('a[href]').each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.startsWith('http')) {
          links.push(href);
        }
      });
    }

    // Recursively scrape linked pages
    const childPages = [];
    for (const link of links.slice(0, 5)) { // Limit to 5 links per page
      const childData = await scrapeUrl(link, maxDepth, currentDepth + 1, format);
      if (childData) {
        childPages.push(childData);
      }
    }

    return {
      url,
      title,
      content,
      format,
      depth: currentDepth,
      childPages: childPages.length > 0 ? childPages : undefined,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      title: 'Error',
      content: `Failed to scrape: ${error.message}`,
      error: true
    };
  }
}

// Scraping endpoint
app.post('/scrape', async (req, res) => {
  const { url, maxDepth = 1, format = 'markdown' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Clear visited URLs for each request
  visitedUrls.clear();

  console.log(`Starting scrape: ${url}, maxDepth: ${maxDepth}, format: ${format}`);

  try {
    const result = await scrapeUrl(url, maxDepth, 0, format);
    res.json(result);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape website',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Web Scraper API is running' });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Web Scraper Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});