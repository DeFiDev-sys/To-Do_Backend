import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import { Types } from "mongoose";
import { ChangePassword, ResquestPassword, UserRequestBody } from "../types/definitions";
import { sendPasswordResetEmail } from "../middlewares/sendPasswordResetVerification";

dotenv.config();

const authrouter = express.Router();

const genToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET!, { expiresIn: "2d" });
};

const genResetToken = (id:Types.ObjectId) => {
  return jwt.sign({ id },process.env.TOKEN_SECRET!, {expiresIn:'15m'})
}

//Register User
const RegisterUser = async (req: Request<{}, {}, UserRequestBody>, res: Response): Promise<string | any> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ email, name, password: hashPassword });
    const newToken = genToken(newUser._id);

    res.status(201).json({
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      token: newToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration" });
  }
};

const LoginUser = async (req: Request<{}, {}, UserRequestBody>, res: Response): Promise<string | any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials, check password or email." });
    }

    const newToken = genToken(user._id);
    res.status(200).json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: newToken,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
    return;
  }
};



// Request new password
const RequestPasswordReset = async (req:Request<{},{},ResquestPassword>,res:Response) : Promise<string | any> =>{
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const {email} =req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials, User not found." })
    }
    if(user){
      const resetToken = genResetToken(user._id);
      sendPasswordResetEmail(resetToken,user.name,user.email,);
      return res.status(200).json({ message: "Email sent successfully." })
    }
  } catch (error) {
    return res.status(500).json({message:'Server error during change of password'})
  }
};


// Newpassword
const NewPassword = async (req: Request<{}, {}, ChangePassword>, res: Response): Promise<string | any> => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as jwt.JwtPayload;

    // Debug logging
    // console.log('Decoded token:', decoded);
    
    const user = await User.findById(new Types.ObjectId(decoded.id));
    // console.log('Found user:', user);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    const tokenAlreadyUsed = user.usedResetTokens.some(
      usedToken => usedToken.token === token
    );
    
    if (tokenAlreadyUsed) {
      return res.status(400).json({ message: 'This reset link has already been used' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    user.usedResetTokens.push({ token });
    user.usedResetTokens = user.usedResetTokens.slice(-5);

    await user.save();
    return res.status(200).json({ message: 'Password changed successfully.' });
    
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: 'Reset link has expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid reset link' });
    }
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Server error during setting new password' });
  }
}

authrouter.route("/register").post(RegisterUser);
authrouter.route("/login").post(LoginUser);
authrouter.route('/request-change-password').post(RequestPasswordReset);
authrouter.route('/reset_password').post(NewPassword)

export { authrouter };
