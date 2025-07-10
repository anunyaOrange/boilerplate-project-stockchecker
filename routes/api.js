'use strict';

module.exports = function (app) {

  let likeArray = [{
    stock: "AMD",
    likes: new Set(["::ffff:127.0.0.1"])
  }];

  app.route('/api/stock-prices')
    .get(function (req, res) {
      const { stock } = req.query;
      const { like } = req.query;
      console.log("stock:", stock, "like:", like);
      console.log("IP", req.ip, req.socket.remoteAddress);

      const stocks = Array.isArray(stock) ? stock : [stock];
      console.log("stocks", stocks);



      
    });

};
