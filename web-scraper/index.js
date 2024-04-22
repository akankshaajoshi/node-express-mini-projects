const PORT = 8000;

const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
const url = "https://en.wikipedia.org/wiki/Quantum_computing";

axios(url)
  .then((res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    const redirectUrls = [];

    $(".mw-redirect").each(function () {
      const title = $(this).attr("title");
      const url = $(this).attr("href");
      redirectUrls.push({ title: title, url: url });
    });

    console.log(redirectUrls);
  })
  .catch((err) => console.log(err));

app.listen(PORT, console.log("Server is running on port: ", PORT));
