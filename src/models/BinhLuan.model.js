const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let BinhLuanSchema = new Schema({
    noidung: {type: String, max: 100, required: true},
    danhgia: {type: Number, 'default': 0, required: true},
    ngaybl: {type: Date, default: Date.now, required: true},
    nguoidung_id: {type: ObjectId, ref: 'NguoiDung', required: true},
    sanpham_id: {type: ObjectId, ref: 'SanPham', required: true}
});

module.exports = mongoose.model('BinhLuan', BinhLuanSchema);