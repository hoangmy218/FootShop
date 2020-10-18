const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let YeuThichSchema = new Schema({
    nguoidung_id: {type: ObjectId, ref: 'NguoiDung', required: true},
    sanpham_ids: [{type: ObjectId, ref: 'SanPham', required: true}],
});

module.exports = mongoose.model('YeuThich', YeuThichSchema);