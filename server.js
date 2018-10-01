const debug = require('debug')('simple-stream-example:server');

const http = require('http');

const address = process.env.PUBLIC_IP_ADDRESS || '127.0.0.1'
const port = process.env.PORT || 1337;
const env = process.env.NODE_ENV || 'development';
const config = require('./config/env')[env];

function configureServer(address, port) {
    require('./api')(config)
    .then(api => {
        const app = require('./config/express')(api, port);
        const server = http.createServer(app);

        server.listen(app.get('port'), address, () => {
            debug('Server Running on http://' + server.address().address + ':' + server.address().port);
        });
    })
    .catch(error => {
        debug('Error Connecting');
        debug(error);
    });
}

configureServer(address, port);

module.exports = configureServer;