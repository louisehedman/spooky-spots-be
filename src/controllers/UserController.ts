import { Response, Request } from "express";
import User from "../models/User";

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

export { getAllUsers, getUser };