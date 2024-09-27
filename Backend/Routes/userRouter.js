const httpStatus = require('http-status');
import express from 'express';
import User from '../Models/userModel';
const VerifyToken = require('../validations/token.verify');
const userRouter = express.Router();
userRouter.route('/')
    .get(VerifyToken, async (req, res) => {
        User.find({}, (err, users) => {
            res.json(users)
        })
    })
    .put(VerifyToken, async (req, res, next) => {
        let user
        try {
            user = await (new User(req.body)).save();
            let resp = await User.sendSuccessResponse(req.body, 'User Successfully Registered', httpStatus.CREATED)
            res.status(resp.status).send(resp)
        } catch (error) {
            console.log(error);
            
            let user = User.checkDuplicateEmail(error)
            return next(res.status(user.status).json(user))
        }
    }).post(VerifyToken, async (req, res, next) => {
        let user
        try {
            const user = await User.findOne({ emailAddress: req.body.email }).exec();
            if (!user) {
                resp = User.sendSuccessResponse({}, 'No User Found', httpStatus.NOT_FOUND);
                res.status(resp.status).send(resp)
            }
            let resp = await User.sendSuccessResponse(user, 'User Details Found', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let user = User.checkDuplicateEmail(error)
            return next(res.status(user.status).json(user))
        }
    });


export default userRouter;
