const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

mongoose.connect("mongodb+srv://anirudhupadhyay05:KjdoeVvmIp4MAjSk@cluster0.lm8rg.mongodb.net/UPayDB");

const userSchema = new Schema({
    username : {
        type : String,
        required :true,
        minLenght : 3,
        maxLenght : 20,
        unique : true 
    },
    firstName : {
        type : String,
        required : true,
        maxLenght : 30,
        trim : true 
    },
    lastName :{
        type : String,
        required : true,
        maxLenght : 30,
        trim : true 
    },
    password :{
        type : String,
        required : true,
        minLenght : 8,
        trim : true 
    }
});

const accountSchema = new mongoose.Schema({
    // TAKING THE REFERNCE OF THE USER SCHEMA FOR THE USER ID 
    // BASIC FEATURE TO JOIN THE TWO COLLECTION IN THE MONGODB 
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

userSchema.method.createHash = async function (plainTextPassword) {
    const saltRound =10;
    const salt = await bcrypt.genSalt(saltRound);
    return bcrypt.hash(plainTextPassword, salt);    
};

userSchema.method.validatePassword = async function (canditatePassword) {
    return await bcrypt.compare(canditatePassword, this.password);
};

//model of userSchema 
const User = mongoose.model("User", userSchema);
const Account  = mongoose.model("Account", accountSchema );

module.exports ={
    User, 
    Account
};

