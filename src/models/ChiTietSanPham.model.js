const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let ChiTietSanPhamSchema = new Schema({
    kichco_id: {type: ObjectId, ref: 'KichCo', require: true},
    mausanpham_id: {type: ObjectId, ref: 'MauSanPham', required: true},
    soluong: {type: Number, required: true}
});

module.exports = mongoose.model('ChiTietSanPham', ChiTietSanPhamSchema);