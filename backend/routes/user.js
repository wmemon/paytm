const express = require('express');
const zod = require("zod");
const {User, Account} = require('../../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const authMiddleware = require('../middleware');

const userRouter = express.Router();
const invalid_type_error = 'Invalid type provided for this field'
const required_error = 'This field cannot be blank'

const signupSchema = zod.object({
    userName: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

userRouter.post("/signup", async (req,res) => {
    const body = req.body;
    console.log(body);
    const success = signupSchema.safeParse(body);
    console.log(success.error);
    if(!success){
        return res.json(
            {
                message: "Email already taken / Incorrect inputs"
            }
        )
    }

    const user = await User.findOne({
        userName: body.userName
    })
    
    if(user){
        return res.json(
            {
                message: "Email already taken / Incorrect inputs"
            }
        )
    }
    
    const dbUser = await User.create(body);
    const accountBalance = Math.floor(Math.random()*10001);
    console.log(accountBalance);
    const accountData = await Account.create({
        userId: dbUser._id,
        balance: accountBalance
    });
    const jwtToken = jwt.sign({
        userId: dbUser._id,
    }, JWT_SECRET)
    
    res.json(
        {
            message: "User created successfully",
            token: jwtToken
        }
    )
})

const signinSchema = zod.object({
    userName: zod.string(),
    password: zod.string()
})

userRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const {success} = signinSchema.safeParse(body);

    if(!success){
        return res.json(
            {
                message: "Error while logging in"
            }
        )
    }

    const checkUser = await User.findOne({
        userName: body.userName,
        password: body.password
    })

    if(!checkUser){
        return res.json(
            {
                message: "Error while logging in"
            }
        )
    }

    const jwtToken = jwt.sign({
        userId: checkUser._id,
    }, JWT_SECRET)

    return res.json(
    {
        token: jwtToken
    }
)
})

const updateSchema = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string({ invalid_type_error, required_error })
        .min(5, 'Password is too short')
});


userRouter.put("/", authMiddleware ,async (req, res) => {
    const id = req.userId;
    const body = req.body;
    const {success} = updateSchema.safeParse(body);
    console.log(success);

    if(!success){
        return res.json(
            {
                message: "Error while updating information"
            }
        )
    }
    try{
    await User.findByIdAndUpdate(id,body);
    return res.json({
        message: "Updated successfully"
    })
    } catch(error){
        return res.json({
            message: "Error while updating information"
        })
    }
})

userRouter.get('/bulk', async (req, res) => {
    const filter = req.query.filter;
    console.log(filter);
    if(!filter){
        return res.status(403).json({
            message: "Error while fetching information"
        })
    }
    try{
    console.log("Starting here");
    const filterData = await User.find({$or: [{firstName: {"$regex" : filter}}, {lastName: {"$regex": filter}}]});
    console.log(filterData)
    res.json(filterData);
    } catch(error){
        return res.status(403).json({
            message: "Error while fetching information"
        })
    }

})




module.exports = {
    userRouter
}
