import { LoginSchema, SignUpSchema } from "../Schemas/AuthSchema.js"
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

export const SignUp = async (req,res)=>{
    try {
        const validateBody = SignUpSchema.parse(req.body);

        // need to add validation for avatar name
        
        // hash the password
        validateBody.password = await bcrypt.hash(validateBody.password,12);
        await prisma.user.create({ data : validateBody});
        return res.status(200).json({
            "message": "User Registered Successfully",
            "user": validateBody
        })
    } catch (error) {
        return res.status(400).json({
            "error": error
        })
    }
     
}

export const Login = async (req,res) =>{
    try {
        const validateBody = LoginSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where:{
                username: validateBody.username
            }
        })
        if(!user){
            return res.status(400).json({
                "error": "User does not exist"
            })
        }
        bcrypt.compare(req.body.password, user.password, (error, result) => {
            if(result) {
                // generate JWT Token 
                const token = jwt.sign({"userId": user.id}, process.env.JWT_SECRET_KEY);
                return res.json({
                    "token": token,
                    "user": user
                }); 
            }
            else {
                return res.status(401).json({
                    "error": "Invalid Password"
                })
            }
          })
    } catch (error) {
        return res.status(500).json({
            "error": error
        })
    }
}