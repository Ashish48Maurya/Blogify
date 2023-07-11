const express = require('express');
const router = express.Router();
const user = require('../models/Users');

router.get('/signUp', (req, res) => {
    res.render('signUp');
  });
  
  router.get('/login', (req, res) => {
    res.render('signIn');
  });
  
  router.post('/signUp', async (req, res) => {
      const { name, gender, email, password, profile_image} = req.body;
      await user.create({
          Username: name,
          Email: email,
          Gender:gender,
          ProfileImg:profile_image,
          password: password
      });
      return res.redirect('/');
  })
  
  router.post('/login',async (req,res)=>{
    const {password,email} = req.body;
    const userFound = await user.findOne({Email:email});
    const ismatch = await bcrypt.compare(password,userFound.Password);
    if(ismatch){
      res.render('home');
    }
    else{
      return res.render('client');
    }
  
  })

module.exports = router;
