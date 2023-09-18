const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
    email: { type: String },
    otp: { type: Number, default: 0 },
    createDate: { type: Date, default: Date.now() }
    
}, { versionKey: false });

const OTPModel = mongoose.model('OTPS', DataSchema);
module.exports = OTPModel;