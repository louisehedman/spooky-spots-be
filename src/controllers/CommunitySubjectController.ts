import { Response, Request } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CommunitySubject from "../models/CommunitySubject";
import User from "../models/User";

// Add community subject
const createCommunitySubject = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    // Only admins are allowed to create community subjects
    if (user.isAdmin === true) {
    const communitySubject = await CommunitySubject.create(req.body);
    communitySubject.save().then(() => {
      res.status(200).json({ message: "Community subject created" });
    });
  }  else {
    res.status(400).json({ message: "You are not allowed to create community subjects" });
  }}
  catch (error: any) {
    res.status(500).json(error.message);
  }
};

// Get all community subjects
const getAllCommunitySubjects = async (req: Request, res: Response) => {
  try {
    const communitySubjects = await CommunitySubject.find();

    if (communitySubjects) {
      return res.status(200).json({
        success: true,
        communitySubjects,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No community subjects found",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// Get one community subject
const getOneCommunitySubject = async (req: Request, res: Response) => {
  const condition = () => {
    if (mongoose.isValidObjectId(req.params.communitySubject)) {
      return { _id: new ObjectId(req.params.communitySubject) };
    }
  };

  CommunitySubject.findOne(
    condition(),
    function (err: Error, communitySubject: mongoose.Document) {
      if (!communitySubject) {
        return res.status(404).json("Community subject does not exist");
      }
      if (err) {
        return res.status(500).send(console.error());
      }
      return res.status(200).json({ communitySubject });
    }
  );
};
export {
  createCommunitySubject,
  getAllCommunitySubjects,
  getOneCommunitySubject,
};
