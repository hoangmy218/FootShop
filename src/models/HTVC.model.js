const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let HTVCSchema = new Schema({
    ten: {type: String, require: true, max: 50},
    phi: {type: Number, required: true}
});


module.exports = mongoose.model('HTVC', HTVCSchema);