const axios = require("axios");
const cheerio = require("cheerio");

async function main(maxPages = 10) {
  const paginationURLsToVisit = ["https://scrapeme.live/shop"];
  const visitedURLs = [];

  const productURLs = new Set();

  while (paginationURLsToVisit.length !== 0 && visitedURLs.length <= maxPages) {
    const paginationURL = paginationURLsToVisit.pop();
    const pageHTML = await axios.get(paginationURL);
    visitedURLs.push(paginationURL);
    const $ = cheerio.load(pageHTML.data);
    //Getting all the pagination urls
    $(".page-numbers a").each((index, element) => {
      const paginationURL = $(element).attr("href");
      if (!visitedURLs.includes(paginationURL) && !paginationURLsToVisit.includes(paginationURL)) {
        paginationURLsToVisit.push(paginationURL);
      }
    });
    $("li.product a.woocommerce-LoopProduct-link").each((index, element) => {
      const productURL = $(element).attr("href");
      productURLs.add(productURL);
    });
  }
  console.log([...productURLs]);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
