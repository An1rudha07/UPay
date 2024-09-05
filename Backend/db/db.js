const mongoose = require("mongoose");

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
    fistName : {
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

const User = mongoose.model("User", userSchema);

module.exports ={
    User,
};

