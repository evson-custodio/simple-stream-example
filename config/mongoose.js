const Mongoose = require('mongoose');
const Grid = require('gridfs-stream');

module.exports.connect = (config) => new Promise((resolve, reject) => {
    if (config) {
        let promise;

        if (config.use_env_variable) {
            promise = Mongoose.connect(process.env[config.use_env_variable], config.options);
        }
        else {
            promise = Mongoose.connect(config.uri, config.options);
        }

        promise.then(() => {
            resolve({
                Mongoose: Mongoose,
                connection: Mongoose.connection,
                db: Mongoose.connection.db,
                gfs: Grid(Mongoose.connection.db, Mongoose.mongo)
            });
        })
        .catch(error => {
            reject(error);
        });
    }
    else {
        reject(new Error('Connection not found!'));
    }
});