const NguoiDung = require('../models/NguoiDung.model')
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator');

exports.auth_signup = async(request, response)=>{
    try {
        const user = new NguoiDung(request.body)
        await user.save()
        const token = await user.generateAuthToken()
        response.status(201).send({ user, token})
    } catch (error) {
        response.status(400).send(error)
    }
}

exports.auth_login = async(request, response)=>{
    
    try {
        const {email, matkhau} = request.body
        
        // const user = await NguoiDung.findByCredentials(email, matkhau)
        const user = await NguoiDung.findOne({email: email})
        
        if (!user){
            return response.status(422).json({message: 'Email or Password is not correct'});
        }
        
        const isPasswordMatch = await bcrypt.compare(matkhau, user.matkhau)
        if (!isPasswordMatch){
            return response.status(422).json({message: 'Email or Password is not correct'});
        }
        const token = await user.generateAuthToken()
        response.send({ user, token})
    } catch (error) {
        response.status(400).send(error)
    }
}

exports.auth_me = async(request, response)=>{
    response.send(request.user)
}

exports.auth_logout = async(request, response)=>{
    try {
        request.user.tokens = request.user.tokens.filter((token)=>{
            return token.token != request.token
        })
        await request.user.save()
        response.json({
            success: true,
            message: 'Logout successfully'
        })
    } catch (error) {
        response.status(500).send(error)
    }    
}

exports.auth_logoutall = async(request, response)=>{
    try {
        request.user.tokens.splice(0, request.user.tokens.length)
        await request.user.save()
        response.json({
            success: true,
            message: 'Logout successfully'
        })
    } catch (error) {
        response.status(500).send(error)
    }
}