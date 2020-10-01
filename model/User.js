const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    DOB: {
        type: Object,
        required: true
    },
    followers: {
        type: Array,
        required: true 
    },
    following: {
        type: Array,
        required: true 
    },
    tags: {
        type: Array,
        required: true 
    },
    desc:{
        type: String,
        required: true
    },
    Date: {
        type: String,
        default: new Date()
    }
});

const User = new mongoose.model("user", userSchema);

module.exports = User;