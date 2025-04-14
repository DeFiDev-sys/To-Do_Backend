import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/definitions";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usedResetTokens: [{
      token: String,
      usedAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

const User =mongoose.model<IUser>('User', userSchema)
export default User