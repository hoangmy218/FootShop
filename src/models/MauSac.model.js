const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MauSacSchema = new Schema({
    ten: {type: String, require: true, max: 50},
    hinh: {type: String, required: true}
});


module.exports = mongoose.model('MauSac', MauSacSchema);