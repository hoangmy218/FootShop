const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ThuongHieuSchema = new Schema({
    thuonghieus_ten: {type: mongoose.Schema.Types.ObjectId, ref: 'SanPham'},
    ten: {type: String, require: true, max: 50},
});


module.exports = mongoose.model('ThuongHieu', ThuongHieuSchema);