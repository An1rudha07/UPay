const express = require("express");
const userRouter = express.Router;
const zod  = require("zod");
const { db, User } = require('../db/db');
const asyncHandler = require("express-async-handler"); 
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config").default;
const  { authMiddleware } = require("../middleware");


const validUser = zod.object({
   username : zod.string().email(),
   firstName : zod.string().min(),
   lastName : zod.string().min(),
   password : zod.string().min(8)
   });

   const user = await User.create({
    username : req.body.username,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    password : req.body.password,

   });

    const signinBody = zod.object({
        username : zod.string().email(),
        password : zod.string()
    })

    const updateBody = zod.object({
        firstName : zod.string().optional(),
        password : zod.string().optional(),
        lastName : zod.string().optional(),
    })
    
   

userRouter.post("/signup", asyncHandler(async(req,res) => {
    //FOR THE VALIDATION OF RIGHT INPUT VALUE
    const {success} = validUser.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message : "Email already taken / Incorrect Input"
        });
    }

    // TO CHECK THE EXISTING USER IF EXIST 
    const existingUser = User.findOne({
        username
    })
    if(existingUser){
        return res.status(411).json({
            message : "Email already taken / Incorrect Input"
        });
    }
    // TO CREATE THE NEW USER 
    const userId = user._id;
    // GENERATING TOKEN FOR THE NEW USER
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
    
}));

    userRouter.get("/signin", asyncHandler(async (req,res) =>{
    //TO VALIDATE THE INPUT VALUE IS RIGHT
        const {success} = signinBody.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message : "Incorrect Input"
            });
        }
     //  TO FIND THE USER USING FINDONE FUNCTION 

        const user = await User.findOne({user});
        if(user){
            const token = jwt.sign({
                userId : user._id
            },JWT_SECRET);
            res.json({
                token : token
            })
            return;
        }
        res.status(411).json({
            message: "Error while logging in"
        });

}));

userRouter.put("/", authMiddleware, async (req,res,next)=>{
    const {success} = upa.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message : "Error while updating information"
            });
        }
        const updateUser = await User.updateOne({ _id : req.userId}, req.body)
        res.json({    
	    message: "Updated successfully"
        });
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});
    
module.exports ={
    userRouter
} 