const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const TurndownService = require("turndown");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const turndownService = new TurndownService();

// ============ SCRAPER LOGIC ============
async function scrapeUrl(url, maxDepth = 1, depth = 0) {
  if (depth >= maxDepth) return null;

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(response.data);
    $("script, style, nav, footer").remove();

    const title = $("title").text() || "Untitled";
    const content = turndownService.turndown($("body").html());

    return {
      url,
      title,
      content,
      depth,
      scrapedAt: new Date().toISOString()
    };
  } catch (err) {
    return { error: err.message };
  }
}

// ============ API ROUTE ============
app.post("/scrape", async (req, res) => {
  const { url, maxDepth = 1 } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const result = await scrapeUrl(url, maxDepth);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Scraping failed" });
  }
});

// ============ FRONTEND ROUTING ============
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
