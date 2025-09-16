const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
})

userSchema.plugin(passportLocalMongoose);//will add username ,hash and salt field to userSchema
//npm pasport-local add methods to userSchema to handle password hashing,auth and salting
//read mongoose npm docs

module.exports = mongoose.model("User", userSchema);