const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ananthakrishnan1213:Asyoulikeit1234@cluster0.ud8dxog.mongodb.net/Library');

const Schema = mongoose.Schema;

const bookschema = new Schema({
    BookName:String,
    BookAuthor:String,
    BookDescription:String,
    BookImage:String
})

const bookdetail = mongoose.model('book',bookschema);
module.exports = bookdetail;