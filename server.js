const debug = require('debug')('simple-stream-example:server');

const http = require('http');

const port = process.env.PORT || 1337;
const env = process.env.NODE_ENV || 'development';
const config = require('./config/env')[env];

function configureServer(port) {
    require('./api')(config)
    .then(api => {
        const app = require('./config/express')(api, port);
        const server = http.createServer(app);

        server.listen(app.get('port'), () => {
            debug('Server Running on http://' + server.address().address + ':' + server.address().port);
        });
    })
    .catch(error => {
        debug('Error Connecting');
        debug(error);
    });
}

configureServer(port);

module.exports = configureServer;