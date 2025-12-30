const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const turndownService = new TurndownService();

// Root route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/scrape', async (req, res) => {
  const { url, extractionType = 'markdown' } = req.body;

  try {
    console.log(`🔍 Scraping: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const title = $('title').text() || 'No title';
    
    let content;
    
    if (extractionType === 'markdown') {
      content = turndownService.turndown(html);
    } else if (extractionType === 'text') {
      content = $('body').text().trim();
    } else {
      // JSON format
      const links = [];
      $('a[href]').each((i, el) => {
        if (i < 20) {
          links.push({
            text: $(el).text().trim(),
            url: $(el).attr('href')
          });
        }
      });

      const headings = [];
      $('h1, h2, h3').each((i, el) => {
        headings.push({
          level: el.name,
          text: $(el).text().trim()
        });
      });

      content = {
        title,
        url,
        text: $('body').text().substring(0, 5000),
        links,
        headings
      };
    }

    console.log(`✅ Scraped successfully!`);

    res.json({
      success: true,
      data: [{
        url,
        title,
        content,
        timestamp: new Date().toISOString()
      }]
    });

  } catch (error) {
    console.error(`❌ Scraping error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Web Scraper running on http://localhost:${PORT}`);
});