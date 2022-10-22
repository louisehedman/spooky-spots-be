import { Response, Request, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ErrorResponse } from "../utils/errorResponse";
import { sendEmail } from "../utils/emailSender";
//import { sendEmail } from "../utils/emailSender";
//import * as sendEmail from "../utils/emailSender"

// Create user
const register = async (req: Request, res: Response, next: any) => {
  try {
    const user = await User.create(req.body);
    user.save().then(() => {
      res.status(201).json({ message: "User created" });
    });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// Login user
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json("Please provide a valid email and password");
  }
  try {
    const user: any | null = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json("No account is registered with this email");
    }
    const isMatch: boolean = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json("Invalid password");
    }
    if (user) {
      const token = jwt.sign(
        { id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET!,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          path: "/",
        })
        .status(200)
        .json({
          success: true,
          username: user.username,
          isAdmin: user.isAdmin,
        });
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

// Logout user
const logout = async (req: Request, res: Response) => {
  return res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    })
    .status(200)
    .json({ success: true, message: "User logged out" });
};

// Send reset-password link to users email
const forgotPassword = async (req: Request, res: Response, next: any) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetUrl = `${process.env.CLIENT_URL}/passwordreset/${resetToken}`;
    const subject = "SpookySpots password reset";
    const message = `
        <h1> You (or someone else) have requested a password reset </h1>
        <p> Please follow the link below to reset your password </p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a> 
        `;
    try {
      await sendEmail({
        to: user.email,
        text: message,
        subject: subject,
      });
      res.status(200).json({
        success: true,
        data: "Email Sent",
      });
    } catch (error) {
      console.log(error)
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({validateBeforeSave: false});

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  }

// Reset password with token got from forgotPassword
const resetPassword = async (req: Request, res: Response, next: any) => {
  const { password } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      data: "Password Reset successful",
    });
  } catch (error) {
    next(error);
  }
};

const authorization = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  // Will be true if cookie is not sent or expired
  if (!token) {
    return res
      .clearCookie("access_token")
      .status(403)
      .json({ message: "No token" });
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err: any, decoded: any) => {
        req.body.id = decoded.id;
      }
    );
    next();
  } catch (error) {
    return res.status(500).json("Could not verify token");
  }
};

export { register, login, logout, forgotPassword, resetPassword, authorization };
  

