const UserModel = require('../Model/UserModel');
const OTPModel = require('../Model/OTPModel');
const SendEmailUtlity = require("../utility/SendEmailUtility");
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');

exports.Registation = async (req, res) => {
    try {
        const reqBody = req.body;
        const data = await UserModel.create(reqBody);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(400).json({ status: 'fail', data: error });
    }
};

exports.Login = async (req, res) => {
    try {
        const reqBody = req.body;
        const data = await UserModel.aggregate([
            { $match: reqBody },
            {
                $project: {
                    _id: 0,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    mobile: 1,
                    photo: 1,
                },
            },
        ]);

        if (data.length > 0) {
            const payload = {
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                data: data[0]['email'],
            };
            const token = jwt.sign(payload, 'SecretKey123456789');
            res.status(200).json({ status: 'success', token, data: data[0] });
        } else {
            res.status(401).json({ status: 'unauthorized' });
        }
    } catch (error) {
        res.status(400).json({ status: 'fail', data: error });
    }
};


exports.ProfileUpdate = async (req, res) => {
    try {
        const email = req.headers.email;
        const reqBody = req.body;
        const data = await UserModel.updateOne({ email }, reqBody);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(400).json({ status: 'fail', data: error });
        
    }
};


exports.ProfileDetails = async (req, res) => {
    try {
        const email = req.headers.email;
        const data = await UserModel.aggregate([
            { $match: { email } },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    mobile: 1,
                    photo: 1,
                    password: 1,
                },
            },
        ]);
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(400).json({ status: 'fail', data: error });
    }
};


exports.RecoveryVerifyEmail = async (req, res) => {
    const email = req.params.email;
    const OTPCode = Math.floor(100000 + Math.random() * 900000);
    
    try {
        const UserCount = await UserModel.aggregate([
            { $match: { email } },
            { $count: 'total' },
        ]);
       
        if (UserCount.length > 0) {
            await OTPModel.create({ email, otp: OTPCode });

            const SendEmail = await SendEmailUtlity(
                email,
                'Your PIN Code is= ' + OTPCode,
                'Task manager PIN Varification'
            );
            res.status(200).json({ status: 'success', data: SendEmail });
        }
        else {
            res.status(200).json({ status: 'fail', data: 'No User Found' });
        }

    } catch (error) {
        
        res.status(200).json({ status: 'fail', data: error });
    }
};



exports.RecoverOTP = async (req, res) => {
    const email = req.params.email;
    const OTPCode = req.params.otp;
    const status = 0;
    const statusUpdate = 1;
    
    try {

        const OTPCount = await OTPModel.aggregate([
            { $match: { email, otp: OTPCode, status } },
            { $count: 'total' },
        ]);

        if (OTPCount.length > 0) {
            await OTPModel.updateOne(
                { email, otp: OTPCode, status },
                { email, otp: OTPCode, statusUpdate }
            );
            res.status(200).json({ status: 'success' });
        }
        else {
            res.status(200).json({ status: 'fail', data: 'Invalid OTP Code' });
        }
        
    } catch (error) {

        res.status(200).json({ status: 'fail', data: error });
        
    }
};



exports.RecoverResetPass = async (req, res) => {
    const email = req.params.email;
    const OTPCode = req.body.OTP;
    const NewPass = req.body.password;
    const statusUpdate = 1;
    try {
        const OTPUsedCount = await OTPModel.aggregate([
            { $match: { email, otp: OTPCode, status: statusUpdate } },
            { $count: 'total' },
        ]);
        if (OTPUsedCount.length > 0) {
            await UsersModel.updateOne({ email }, { password: NewPass });
            res.status(200).json({ status: 'success' });
        } else {
            res.status(200).json({ status: 'fail', data: 'Invalid Request' });
        }
    } catch (error) {
        res.status(200).json({ status: 'fail', data: error });
    }
}

