const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let ChiTietDonHangSchema = new Schema({
    ctsp_id: {type: ObjectId, ref: 'ChiTietSanPham', required: true},
    donhang_id: {type: ObjectId, ref: 'DonHang', required: true},
    soluongdat: {type: Number, required: true},
    dongia: {type: Number, required: true},
    khuyenmai: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('ChiTietDonHang', ChiTietDonHangSchema);