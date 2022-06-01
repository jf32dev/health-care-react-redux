require("babel-register")({
  presets: ["es2015", "react"]
});
 
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;
const axios = require('axios');

async function generateSitemap() {
  const articles = await axios.get('https://www.clubafib.com/api/data/article');
  const { data } = articles.data;
  let idMap = [];
  for (let item of data) {
    let titleSplit = item.title.replace(/[^a-zA-Z0-9 ]/g, '');
    titleSplit = titleSplit.replace(/\s+$/, '');
    titleSplit = encodeURI(titleSplit);
    titleSplit = titleSplit.toLowerCase().replace(/%20/g, '-');
    let param = titleSplit + "-" + item.id;
    idMap.push({ id: param });
  }
  const paramsConfig = {
    "/article/:id": idMap
  };
  return (
    new Sitemap(router)
      .applyParams(paramsConfig)
      .build("https://www.clubafib.com")
      .save("./public/sitemap.xml")
  );
}

generateSitemap();