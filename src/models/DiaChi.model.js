const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let DiaChiSchema = new Schema({
    ten: {type: String, require: true, max: 50},
    dienthoai: {type: String, require: true, min:10, max:12},
    diachi: {type: String, require: true, min: 10, max: 100},
    nguoidung_id: {type: ObjectId, ref: 'NguoiDung', required: true},
    macdinh: {type: Boolean, default: false}
});

module.exports = mongoose.model('DiaChi', DiaChiSchema);