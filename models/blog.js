const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const User = require('../models/Users');

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  coverImg: {
    type: String,
    required: false,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  expireAt: {
    type: Date,
    default: Date.now() + 300000,
  },
}, { timestamps: true });

const Blog = model('blog_v3', blogSchema);

module.exports = Blog;