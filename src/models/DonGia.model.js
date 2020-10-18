const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let DonGiaSchema = new Schema({
    dongia: {type: Number, required: true, default: 1000},
    ngay: {type: Date, default: Date.now, required: true},
    sanpham_id: {type: ObjectId, ref: 'SanPham', require: true}
});

module.exports = mongoose.model('DonGia', DonGiaSchema);