const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let HinhAnhSchema = new Schema({
    hinh: {type: String, require: true},
    stt: {type: Number, require: true}
});

module.exports = mongoose.model('HinhAnh', HinhAnhSchema);