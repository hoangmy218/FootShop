const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let GioHangSchema = new Schema({
    nguoidung_id: {type: ObjectId, ref: 'NguoiDung', required: true},
    ctsp_id: {type: ObjectId, ref: 'ChiTietSanPham', required: true},
    soluongdat: {type: Number, default: 1, required: true}
});

module.exports = mongoose.model('GioHang', GioHangSchema);