const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let PhieuNhapSchema = new Schema({
    tongnhap: {type: Number, 'default': 0},
    tongtien: {type: Number, 'default': 0},
    trangthai: {type: Boolean, default: false, require: true},
    nhacungcap_id: {type: ObjectId, ref: 'NhaCungCap', require: true},
    ngay: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('PhieuNhap', PhieuNhapSchema);