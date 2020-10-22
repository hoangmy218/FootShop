const { response } = require('express')
const jwt = require('jsonwebtoken')
const NguoiDung = require('../models/NguoiDung.model')
const role = require('./role')

const auth = async(request, response, next)=> {
    // console.log(request.header('Authorization'))
    const token = request.header('Authorization').replace('Bearer ', '');
    // console.log(token)
    // console.log('token', token.length)
    if (token == "Bearer") 
        return response.status(401).send({
            success: false,
            error: 'Access Denied'
        });
    const data = jwt.verify(token, process.env.JWT_KEY)
    try {
        
        const user = await NguoiDung.findOne({ _id: data._id, 'tokens.token': token})
        if (!user){
            return response.status(422).send({ error: 'Email or Password is not correct'});
        }

        if(role[data.role].find(function(url){ 
            return url==request.baseUrl
        })){
            request.user=user
            next();
        }
        else
            return response.status(401).send({ error: "You do not have permission"});

    } catch (error) {
        response.status(400).send({ error: 'Invalid Token', data: data})
    }
}

module.exports = auth

