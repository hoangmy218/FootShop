const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let SanPhamSchema = new Schema({
    ten: {type: String, require: true, min: 5, max: 50},
    mota: {type: String, required: true, min:10, max:100},
    trangthai: {type: Boolean, default: true, require: true},
    danhmuc_id: {type: ObjectId, ref: 'DanhMuc', require: true},
    thuonghieu_id: {type: ObjectId, ref: 'ThuongHieu', required: true},
    khuyenmai_id: {type: ObjectId, ref: 'KhuyenMai'}
});

module.exports = mongoose.model('SanPham', SanPhamSchema);