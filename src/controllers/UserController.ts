import { Response, Request } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    // Only admins is allowed to get users
    if (user.isAdmin === true) {
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
    } else {
      res.status(400).json({ message: "You are not allowed to access this" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// Get signed in user
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

// Get one user
const getOneUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

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

// Edit user
const editUser = async (req: Request, res: Response) => {
  try {
    let { isAdmin, email } = req.body;
    const editedUser: any = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          isAdmin: isAdmin,
          email: email,
        },
      },
      { new: true }
    );
    res.status(200).json(editedUser);
  } catch (err) {
    res.status(500).json({ message: "Error while trying to edit user" });
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
      const confirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);
      if (password === confirmPassword) {
        await User.findByIdAndUpdate(
          { _id: user.id },
          { password: password, confirmPassword: confirmPassword },
          { new: true }
        );
        return res.status(200).json({ status: true, message: "Password changed successfully" });
      } else {
        return res.status(401).json({
          status: false,
          message: "Password and confirmation do not match",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ status: false, error: "Error occured" });
  }
};

// Let user change email when signed in
const changeEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    if (user) {
      const email = await req.body.email;
      const userEmail = await User.findByIdAndUpdate(
        { _id: user.id },
        { email: email },
        { new: true }
      );
      return res.status(200).json({ status: true, data: userEmail });
    }
  } catch (error) {
    return res.status(400).json({ status: false, error: "Error occured" });
  }
};

export {
  getAllUsers,
  getUser,
  getOneUser,
  changePassword,
  changeEmail,
  editUser,
  deleteUser,
};
