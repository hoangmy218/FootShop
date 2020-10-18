const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let KhuyenMaiSchema = new Schema({
    chude: {type: String, require: true, min: 5, max: 50},
    mota: {type: String, required: true, min:10, max:100},
    giamgia: {type: Number, required: true, default: 0},
    hinh: {type: String},
    trangthai: {type: Boolean, default: false, require: true},
    ngaybd: {type: Date, required: true},
    ngaykt: {type: Date, required: true},
    sanpham_id: [{type: ObjectId, ref: 'SanPham'}]
});

module.exports = mongoose.model('KhuyenMai', KhuyenMaiSchema);