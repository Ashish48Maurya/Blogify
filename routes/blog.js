const express = require('express');
const router = express.Router();
const blog = require('../models/blog');

router.get('/addBlog',(req,res)=>{
    res.render('addBlog');
})

router.post('/',(req,res)=>{
    
})

module.exports = router;