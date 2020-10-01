const mongoose = require('mongoose');

const date = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const postSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    mediaURL:{
        type: String,
        required: true
    },
    likes: {
        type: Array,
        required: true 
    },
    comments: {
        type: Array,
        required: true 
    },
    Date: {
        type: String,
        default: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }
});

const Post = new mongoose.model("post", postSchema);

module.exports = Post;