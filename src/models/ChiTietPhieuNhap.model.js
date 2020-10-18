const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let ChiTietPhieuNhapSchema = new Schema({
    chitietsanpham_id: {type: ObjectId, ref: 'ChiTietSanPham', required: true},
    phieunhap_id: {type: ObjectId, ref: 'PhieuNhap', required: true},
    soluongnhap: {type: Number, required: true},
    dongianhap: {type: Number, required: true}
});

module.exports = mongoose.model('ChiTietPhieuNhap', ChiTietPhieuNhapSchema);