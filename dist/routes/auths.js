"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authrouter = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const mongoose_1 = require("mongoose");
const sendPasswordResetVerification_1 = require("../middlewares/sendPasswordResetVerification");
dotenv_1.default.config();
const authrouter = express_1.default.Router();
exports.authrouter = authrouter;
const genToken = (id) => {
  return jsonwebtoken_1.default.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "2d" });
};
const genResetToken = (id) => {
  return jsonwebtoken_1.default.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "15m" });
};
//Register User
const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    const userExist = await UserModel_1.default.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashPassword = await bcryptjs_1.default.hash(password, salt);
    const newUser = await UserModel_1.default.create({ email, name, password: hashPassword });
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
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    const user = await UserModel_1.default.findOne({ email });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
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
const RequestPasswordReset = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { email } = req.body;
    const user = await UserModel_1.default.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials, User not found." });
    }
    if (user) {
      const resetToken = genResetToken(user._id);
      (0, sendPasswordResetVerification_1.sendPasswordResetEmail)(resetToken, user.name, user.email);
      return res.status(200).json({ message: "Email sent successfully." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error during change of password" });
  }
};
// Newpassword
const NewPassword = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { token, newPassword } = req.body;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    // Debug logging
    // console.log('Decoded token:', decoded);
    const user = await UserModel_1.default.findById(new mongoose_1.Types.ObjectId(decoded.id));
    // console.log('Found user:', user);
    if (!user) return res.status(404).json({ message: "User not found" });
    const tokenAlreadyUsed = user.usedResetTokens.some((usedToken) => usedToken.token === token);
    if (tokenAlreadyUsed) {
      return res.status(400).json({ message: "This reset link has already been used" });
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
    user.password = hashedPassword;
    user.usedResetTokens.push({ token });
    user.usedResetTokens = user.usedResetTokens.slice(-5);
    await user.save();
    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
      return res.status(400).json({ message: "Reset link has expired" });
    }
    if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid reset link" });
    }
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Server error during setting new password" });
  }
};
authrouter.route("/register").post(RegisterUser);
authrouter.route("/login").post(LoginUser);
authrouter.route("/request-change-password").post(RequestPasswordReset);
authrouter.route("/reset_password").post(NewPassword);
