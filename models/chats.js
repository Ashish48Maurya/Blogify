const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog_v3",
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

const chat = mongoose.model('Chat',chatSchema);
module.exports = chat;