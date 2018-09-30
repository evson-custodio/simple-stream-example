const express = require('express');

const logger = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const cors = require('cors');
const handlerError = require('errorhandler');

module.exports = (api, port) => {
    const app = express();

    app.set('port', port);

    app.use(logger('dev'));
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(serveStatic('public'));

    app.use(cors());

    app.use('/api/file', api.routes.file);

    if (app.get('env') === 'development') {
        app.use(handlerError());
    }

    return app;
}