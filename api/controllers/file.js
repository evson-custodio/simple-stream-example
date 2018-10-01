const debug = require('debug')('simple-stream-example:api:controllers:file');

module.exports = (api) => {
    // const FileSchema = require('mongoose').model('File');
    const FileSchema = api.models.file;
    const ObjectId = api.mongoose.Mongoose.Types.ObjectId;
    const gfs = api.mongoose.gfs;

    return {
        handlerId: (req, res, next, id) => {
            req.id = new ObjectId(id);
            next();
        },
        handlerName: (req, res, next, name) => {
            req.name = name;
            next();
        },
        create: (req, res) => {
            let ws = gfs.createWriteStream({
                filename: req.headers.filename
            });
            req.pipe(ws);
            ws.on('close', file => {
                debug('File created ' + file.filename + '!');
                res.status(201).json(file);
            });
        },
        getById: (req, res) => {
            console.log('getById!');
            res.append('Connection', 'keep-alive');
            res.append('Transfer-Encoding', 'chunked');
            gfs.createReadStream({_id: req.id}).pipe(res)
            .on('finish', () => {
                debug('File sent by id!');
            });
        },
        getByName: (req, res) => {
            res.append('Connection', 'keep-alive');
            res.append('Transfer-Encoding', 'chunked');
            gfs.createReadStream({filename: req.name}).pipe(res)
            .on('finish', () => {
                debug('File sent by name!');
            });
        },
        deleteById: (req, res) => {
            gfs.remove({_id: req.id}, err => {
                if (err) {
                    res.status(400).json(err);
                }
                else {
                    debug('File ' + file.filename + ' deleted by id!');
                    res.send('OK!');
                }
            });
        },
        deleteByName: (req, res) => {
            gfs.remove({filename: req.name}, err => {
                if (err) {
                    res.status(400).json(err);
                }
                else {
                    debug('File ' + file.filename + ' deleted by name!');
                    res.send('OK!');
                }
            });
        },
        list: (req, res) => {
            FileSchema.find(req.query)
            .exec()
            .then(files => {
                debug('Files: ');
                debug(files);
                res.json(files);
            })
            .catch(error => {
                res.status(400).json(error);
            });
        }
    }
}