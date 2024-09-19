const express = require("express");
const userRouter = express.Router();
const zod  = require("zod");
const { db, User, Account } = require('../db/db');
const asyncHandler = require("express-async-handler"); 
const jwt = require("jsonwebtoken");
const  {JWT_SECRET} = require('../config')
const { authMiddleware } = require("../middleware");

// Validation schemas
const validUser = zod.object({
   username: zod.string().email(),
   firstName: zod.string().min(1),
   lastName: zod.string().min(1),
   password: zod.string().min(8)
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

const updateBody = zod.object({
    firstName: zod.string().optional(),
    password: zod.string().optional(),
    lastName: zod.string().optional(),
});

// Signup Route
userRouter.post("/signup", asyncHandler(async(req, res) => {
    const { success } = validUser.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect Input"
        });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect Input"
        });
    }

    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userId }, JWT_SECRET, {expiresIn : '60d'});

    res.json({
        message: "User created successfully",
        token: token
    });
}));

// Signin Route
userRouter.post("/signin", asyncHandler(async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect Input"
        });
    }

    const user = await User.findOne({ username: req.body.username });
    if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        return res.json({ token: token });
    }

    res.status(411).json({
        message: "Error while logging in"
    });
}));

// Update User Route
userRouter.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    await User.updateOne({ _id: req.userId }, req.body);
    res.json({ message: "Updated successfully" });
});

// Bulk Users Route
userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstName: { "$regex": filter } },
            { lastName: { "$regex": filter } }
        ]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = userRouter;
