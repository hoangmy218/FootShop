const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let NhaCungCapSchema = new Schema({
    ten: {type: String, require: true, max: 50},
    email: {type: String, required: true, min:10, max:30},
    dienthoai: {type: String, require: true, min:10, max:12},
    diachi: {type: String, require: true, min: 10, max: 100}
});

module.exports = mongoose.model('NhaCungCap', NhaCungCapSchema);