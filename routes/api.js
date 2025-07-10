'use strict';

module.exports = function (app) {

  let likeArray = [{
    stock: "AMD",
    likes: new Set(["::ffff:127.0.0.1"])
  }];

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock } = req.query;
      const { like } = req.query;
      console.log("================");
      console.log("stock:", stock, "like:", like);
      console.log("IP", req.ip, req.socket.remoteAddress);

      const stocks = Array.isArray(stock) ? stock : [stock];
      console.log("stocks", stocks);

      const addLike = (stock) => {
        const foundStock = likeArray.find(s => s.stock === stock);
        console.log("addLike/foundStock", foundStock);
        if (foundStock) {
          foundStock.likes.add(req.ip)
        } else {
          likeArray.push({
            stock: stock,
            likes: new Set([req.ip])
          });
        }
      }

      if (like) stocks.forEach(s => addLike(s));

      const stockData = await Promise.all(
        stocks.map(async (stock) => {
          const sData = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
          const data = await sData.json();
          let likeCount = 0;
          const foundStock = likeArray.find(s => s.stock === data.symbol);
          console.log("Promise/foundStock", foundStock);
          if (foundStock) likeCount = foundStock.likes.size;
          return {
            stock: data.symbol,
            price: data.latestPrice,
            likes: likeCount
          };
        })
      );

      let result;
      if (stockData.length > 1) {
        stockData[0].rel_likes = stockData[0].likes - stockData[1].likes;
        stockData[1].rel_likes = stockData[1].likes - stockData[0].likes;
        delete stockData[0]['likes'];
        delete stockData[1]['likes'];
        result = stockData;
      } else {
        result = stockData[0];
      }

      console.log("result", { stockData: result });
      res.json({ stockData: result });
    });

};
