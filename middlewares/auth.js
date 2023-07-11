require('dotenv').config();
const jwt = require('jsonwebtoken')

const verifyUser = async (req, res, next) => {
    try {
      const browserToken = req.cookies.jwt;
      const verifyUser = jwt.verify(browserToken, process.env.SECRET_KEY);
      const ans = verifyUser._id;
      if (verifyUser) {
        // Store the value in the req object
        req.verifyUserValue = ans;
        next();
      } else {
        res.send("You Are Not A Genuine User");
      }
    } catch (err) {
      res.send("Seems You Don't Have Stored Cookies of this site - Login First");
    }
  };

module.exports = verifyUser;


const User = require('../models/Users');

