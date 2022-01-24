const Logger = require('../logger.js');

const express = require('express');

function load() {

}

function logRequest(req, res, next)
{
    Logger.middleware('REQUEST', `${req.originalUrl} [${req.method}: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress }]`);
    next();
}

function listen(port) {
    const app = express();
    app.listen(port);
    Logger.info(`LISTENING ON ${port}...`);
    
    Logger.info(`Setting up basic middleware...`);
    app.use(logRequest);

    app.use(express.static('client/public/'));

    app.get('/', (req, res) => { res.end('lol') })
}

module.exports = {
    load,
    listen
};