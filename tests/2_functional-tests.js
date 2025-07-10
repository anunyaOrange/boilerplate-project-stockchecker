const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    test('Viewing one stock', function (done) {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                const data = JSON.parse(res.text);
                assert.equal(data.stockData.stock, "GOOG");
                done(); // Signal Mocha that the asynchronous test is complete
            });
    });

    test('Viewing one stock and liking it', function (done) {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                const data = JSON.parse(res.text);
                assert.equal(data.stockData.stock, "GOOG");
                assert.equal(data.stockData.likes, 1);
                done(); // Signal Mocha that the asynchronous test is complete
            });
    });

    test('Viewing the same stock and liking it again', function (done) {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                const data = JSON.parse(res.text);
                assert.equal(data.stockData.stock, "GOOG");
                assert.equal(data.stockData.likes, 1);
                done(); // Signal Mocha that the asynchronous test is complete
            });
    });

    test('Viewing two stocks', function (done) {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&stock=AMD')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                const data = JSON.parse(res.text);
                assert.equal(data.stockData[0].stock, "GOOG");
                assert.equal(data.stockData[1].stock, "AMD");
                done(); // Signal Mocha that the asynchronous test is complete
            });
    });

    test('Viewing two stocks and liking them', function (done) {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&stock=AMD&like=true')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                const data = JSON.parse(res.text);
                assert.equal(data.stockData[0].stock, "GOOG");
                assert.equal(data.stockData[1].stock, "AMD");
                assert.equal(data.stockData[0].rel_likes, 0);
                assert.equal(data.stockData[1].rel_likes, 0);
                done(); // Signal Mocha that the asynchronous test is complete
            });
    });
});
