require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.resolve('/public')));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
        Username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        Email:{
            unique:true,
            type:String,
            required:true
        },
        Gender:{
            type:String,
        },
        ProfileImg:{
        type:String,
        },
        tokens:[{
            token1:{
                type:String,
                required:true
            }
        }]
});

userSchema.methods.generateToken = async function(){

    try{
        const token = jwt.sign({_id:this._id.toString() , email:this.Email},process.env.SECRET_KEY ,{ expiresIn: '1w' });
        this.tokens = this.tokens.concat({token1:token});
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}

// userSchema.pre("save",async function(next){
//     if(this.isModified('password')){
//     let salt = bcrypt.genSaltSync(10);
//     let hash = bcrypt.hashSync(this.password, salt);
//     }
//     next();
// })

userSchema.pre('save',async function(next){
    if(!this.ProfileImg){
         this.ProfileImg = "/images/avatar.png";
    }
    next();
})

const user =  mongoose.model('User', userSchema);
module.exports = user;
