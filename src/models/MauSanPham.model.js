const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let MauSanPhamSchema = new Schema({
    sanpham_id: {type: ObjectId, ref: 'SanPham', require: true},
    mausac_id: {type: ObjectId, ref: 'MauSac', required: true},
    hinh: [{type: ObjectId, ref: 'HinhAnh', required: true}]
});

module.exports = mongoose.model('MauSanPham', MauSanPhamSchema);