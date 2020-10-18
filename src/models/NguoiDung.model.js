const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
require('dotenv').config();
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


let NguoiDungSchema = new Schema({
    ten: {type: String, require: true},
    email: {type: String, unique: true, require: true, validate: value => {
        if (!validator.isEmail(value)) {
            throw new Error({error: 'Invalid Email address'})
        }
    }},
    dienthoai: {type: String, require: true},
    matkhau: {type: String, require: true, minlength: 7},
    gioitinh: {type: Boolean, require: true},
    ngaysinh: {type: Date, require: true},
    trangthai: {type: Boolean, default: true, require: true},
    hinh: {type: String},
    role: {type: String, default: 'customer'},
    tokens: [{
        token: {type: String, required: true}
    }]
});

NguoiDungSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('matkhau')){
        user.matkhau = await bcrypt.hash(user.matkhau, 8)
    }
    next()
})

NguoiDungSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id, role: user.role}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

NguoiDungSchema.statics.findByCredentials = async (email, matkhau) => {
    const user = await NguoiDung.findOne({email})
    
    if (!user){
        //return response.status(422).send('Email or Password is not correct');
        throw new Error({ error: 'Email or Password is not correct'})
    }
    const isPasswordMatch = await bcrypt.compare(matkhau, user.matkhau)
    if (!isPasswordMatch){
        // return response.status(422).send('Email or Password is not correct');
        throw new Error({ error: 'Email or Password is not correct'})
    }
    return user
}
const NguoiDung = mongoose.model('NguoiDung', NguoiDungSchema)

module.exports = mongoose.model('NguoiDung', NguoiDungSchema)