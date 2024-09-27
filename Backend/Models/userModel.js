import mongoose from 'mongoose';
import APIError from '../Utils/APIError';
import SuccessRes from '../Utils/SuccessRes';
const config = require('../Utils/config');
const httpStatus = require('http-status');

const Schema = mongoose.Schema;
const roles = ['user', 'admin'];
const bcrypt = require('bcryptjs');

const userModel = new Schema({
    userName: {
        type: String,
        required: false,
        unique: false,
    },
    emailAddress: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        match: /(?=^.{8,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    name: {
        type: String,
        required: true,
        maxlength: 128,
        index: true,
        trim: true,
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: roles,
        default: 'user',
    }
});
userModel.pre('save', async function save(next) {
    let self = this;
    try {
        if (!this.isModified('password')) return next();
        const rounds = 10;
        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;
        return next();
    } catch (error) {
        return next(error);
    }
});
userModel.statics = {
    roles,
    getErrorMessage(error, errorType, data) {
        let apiError
        switch (errorType) {
            case 'MongoError':
                apiError = new APIError({
                    message: 'Email Address Already Exists',
                    data: data,
                    status: httpStatus.CONFLICT,
                });
                break;
            case 'ValidationError':
                apiError = new APIError({
                    message: error.message,
                    data: data,
                    status: httpStatus.CONFLICT,
                });
                break;
            default:
                apiError = new APIError({
                    message: 'User not Registered',
                    data: data,
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                });
                break;
        }
        return apiError;
    },
    sendSuccessResponse(data, msg, status) {
        return new SuccessRes({
            message: msg,
            data: data,
            status: status
        });
    },
    checkDuplicateEmail(error) {
        console.log(error.name)
        return this.getErrorMessage(error, error.name, {})
    }
}
export default mongoose.model('users', userModel)