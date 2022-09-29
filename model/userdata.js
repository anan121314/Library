const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ananthakrishnan1213:Asyoulikeit1234@cluster0.ud8dxog.mongodb.net/Library');

const Schema = mongoose.Schema;

const userschema = new Schema({
    UserName:String,
    Useremail:String,
    DOB:Date,
    PhoneNo:Number,
    Password:String
})

const userdetail = mongoose.model('user',userschema);
module.exports = userdetail;