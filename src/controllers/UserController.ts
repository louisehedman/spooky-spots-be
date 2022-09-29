import { Response, Request } from "express";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    // Only admin is allowed to get users
    if (user.role === 1){
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
      }
      } catch (error) {
        return res.status(500).json({ success: false, error });
      }
  };


const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id)

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

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  const condition = () => {
    if (mongoose.isValidObjectId(req.params.id)) {
      return { _id: new ObjectId(req.params.id) };
    }
  };

  User.findOneAndDelete(
    condition(),
    function (err: Error, user: mongoose.Document) {
      if (!user) {
        return res.status(404).json("User does not exist");
      }
      if (err) {
        return res.status(500).send(console.error());
      }
      return res.status(200).json("User deleted");
    }
  );
};

// Let user change password when signed in
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

// Let user change email when signed in
const changeEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    if (user) {
      const email = await (req.body.email);
      const userEmail = await User.findByIdAndUpdate({_id: user.id}, {email: email}, { new: true})
      return res.status(200).json({status: true, data: userEmail})
    } 
  } catch (error) {
      return res.status(400).json({status: false, error: "Error occured"});
    }
};



export { getAllUsers, getUser, changePassword, changeEmail, deleteUser };