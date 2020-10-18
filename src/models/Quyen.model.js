const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let QuyenSchema = new Schema({
    ten: {type: String, require: true, max: 50},
});


module.exports = mongoose.model('Quyen', QuyenSchema);