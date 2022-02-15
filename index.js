const https = require("https");
const cheerio = require("cheerio");
const fs = require("fs");
let baseUrl=`https://unsplash.com/t/travel`
https.get(baseUrl, function (res) {
  let html = "";
  res.on("data", function (chunk) {
    html += chunk;
  });
  res.on("end", function () {
    const $ = cheerio.load(html);
    let allFilms = [];
    $("figure").each(function () {
      const src = $(".YVj9w", this).attr("srcset");
      var b =  src.split(',')
      var h = b[b.length-1]
      var a = h.split(' ')
      var d = a[1]
      const title = $(".YVj9w", this).attr("alt");
      allFilms.push({
        title,
        d
      });
    });
    downloadImage(allFilms);
  });
  function downloadImage(allFilms) {
    for (let i = 0; i < allFilms.length; i++) {
      const picUrl = allFilms[i].d;
      // 请求 -> 拿到内容
      // fs.writeFile('./xx.png','内容')
      https.get(picUrl, function (res) {
        res.setEncoding("binary");
        let str = "";
        res.on("data", function (chunk) {
          str += chunk;
        });
        res.on("end", function () {
          fs.writeFile(`./images/${i}.png`, str, "binary", function (err) {
            if (!err) {
              console.log(`第${i}张图片下载成功`);
            }
          });
        });
      });
    }
  }
})
