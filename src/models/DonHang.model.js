const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let DonHangSchema = new Schema({
    ghichu: {type: String, max: 100},
    tongtien: {type: Number, 'default': 0, required: true},
    trangthai: {type: Number, 'default': 1, require: true},
    diachi_id: {type: ObjectId, ref: 'DiaChi', require: true},
    ngaydat: {type: Date, default: Date.now, required: true},
    nguoidung_id: {type: ObjectId, ref: 'NguoiDung', required: true},
    thanhtoan_id: {type: ObjectId, ref: 'HTTT', required: true},
    vanchuyen_id: {type: ObjectId, ref: 'HTVC', required: true}
});

module.exports = mongoose.model('DonHang', DonHangSchema);