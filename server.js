import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Your upstream proxy (from curl)
const PROXY_HOST = "23.95.150.145";
const PROXY_PORT = 6114;

// Endpoint: /proxy?url=https://example.com
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing ?url=" });
  }

  try {
    const response = await fetch(targetUrl, {
      agent: new (require("http-proxy-agent"))(`http://${PROXY_HOST}:${PROXY_PORT}`)
    });

    const data = await response.text();
    res.send(data);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
