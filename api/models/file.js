module.exports = (api) => {
    const Mongoose = api.mongoose.Mongoose;

    const FileSchema = Mongoose.Schema({}, { strict: false });
    
    return Mongoose.model('File', FileSchema, 'fs.files');
}