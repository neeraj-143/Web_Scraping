document.addEventListener("DOMContentLoaded", () => {
  const scrapeBtn = document.getElementById("scrapeBtn");
  const result = document.getElementById("result");

  scrapeBtn.addEventListener("click", async () => {
    const url = document.getElementById("url").value;

    if (!url) {
      result.textContent = "❌ Please enter a URL.";
      return;
    }

    result.textContent = "⏳ Scraping in progress...";

    try {
      const res = await fetch("/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      result.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      result.textContent = "❌ Error: " + err.message;
    }
  });
});
