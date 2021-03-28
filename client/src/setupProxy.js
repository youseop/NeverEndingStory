const { createProxyMiddleware } = require('http-proxy-middleware');

const config = require('./config/key');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: config.SERVER,
            changeOrigin: true,
        })
    );
};