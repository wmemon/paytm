const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://wmemon100:wasim123@cluster0.hmbxzzq.mongodb.net/')

const userSchama = new mongoose.Schema(
    {
       firstName : String,
       lastName: String,
       userName: String,
       password: String,
    }
);

const bankSchema = new mongoose.Schema({
    userId: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
    balance: Number
})

const User = mongoose.model('User', userSchama);
const Account = mongoose.model('Account', bankSchema);

module.exports = {User, Account};