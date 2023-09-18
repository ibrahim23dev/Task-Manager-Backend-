const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    password: { type: String },
    photo:{type:String},
    createdDate: { type: Date, default: Date.now() }
}, { versionKey: false });

const UserModel = mongoose.model("User", DataSchema);
module.exports = UserModel;