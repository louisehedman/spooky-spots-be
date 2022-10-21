import { Response, Request, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

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
          .json({ success: true, username: user.username, isAdmin: user.isAdmin });
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
  
  export { register, login, logout, authorization };
  