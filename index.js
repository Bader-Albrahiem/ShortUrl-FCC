const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/View/index.html");
});
var urlDb = [];
var nextUrl = 1;
app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' in the request body" });
  }
  const shorturl = nextUrl++;
  if (url.startsWith("https://")) {
    // Replace 'http://' with 'https://'
    urlDb.push({ original_url: url, short_url: shorturl });
  } else if (!url.includes("://")) {
    // If the URL doesn't have any protocol, add 'https://'
    res.json({ error: "invalid url" });
  }

  res.json({ original_url: url, short_url: shorturl });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;
  var checkUrl = urlDb.find((item) => {
    return item.short_url === parseInt(short_url);
  });

  if (!checkUrl || checkUrl.length < 1) {
    res.json({ error: "No URL found for the given short URL" });
  } else {
    res.redirect(checkUrl.original_url);
  }
});
const listner = app.listen(port, () => {
  console.log(`Server is listen on port: ${port}`);
});
