const Quyen = require('../models/Quyen.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator');

exports.quyen_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try {
        var q = await Quyen.find({ ten: request.body.ten}).exec();
        if (q.length != 0){
            response.json({          
                message: 'Role has exist',
                data: q
            });
        } else {
            var quyen = new Quyen(request.body);
            var result = await quyen.save();
            response.json({
                success: true,
                message: 'Role created successfully',
                data: result
            });
        }

    } catch (error){
        response.send(error);
    }
};

exports.quyen_list = async(request, response) =>{
    try {
        var result = await Quyen.find().exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.quyen_get = async(request, response)=>{
    try{
        var result = await Quyen.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                message: 'Role not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.quyen_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try{
        var result = await Quyen.findById(request.params.id).exec();
        if (result){
            //Check name unique
            var q = await Quyen.find({ ten: request.body.ten}).exec();
            if ((q.length == 0) || (q[0].id == request.params.id)){
                result.set(request.body);
                var res = await result.save();
                response.json({
                    success: true,
                    message: 'Role updated successfully',
                    data: res
                });
            }
            if (q[0]._id != request.params.id){
                response.json({          
                    message: 'Role has exist',
                    data: q
                });
            }
            
        } else{
            response.json({
                message: 'Role not found'
            });
        }
        
    } catch(error){
        response.send(error);
    }
}

exports.quyen_delete = async(request, response)=>{
    try{
        var result = await Quyen.findById(request.params.id).exec();
        if (result){
            var result = await Quyen.deleteOne({ _id: request.params.id}).exec();
            response.json({
                message: 'Role deleted successfully'
            });
        } else{
            response.json({
                message: 'Role not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}