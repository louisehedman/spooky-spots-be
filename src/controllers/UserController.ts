import { Response, Request } from "express";
import User from "../models/User";
import bcrypt from 'bcryptjs';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
    
        if (users) {
          return res.status(200).json({
            success: true,
            users,
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "No users found",
          });
        }
      } catch (error) {
        return res.status(500).json({ success: false, error });
      }
  };


const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);

    if (user) {
      return res.status(200).json({
        success: true,
        user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const userPassword = await User.findByIdAndUpdate({_id: user.id}, {password: password}, { new: true})
      return res.status(200).json({status: true, data: userPassword})
    } 
  } catch (error) {
      return res.status(400).json({status: false, error: "Error occured"});
    }
};

export { getAllUsers, getUser, changePassword };