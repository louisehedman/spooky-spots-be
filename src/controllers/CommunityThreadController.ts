import { Response, Request, RequestHandler } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CommunitySubject from "../models/CommunitySubject";
import CommunityThread from "../models/CommunityThread";
import User from "../models/User";

// GET request to find threads by subject id
const getCommunityThreads: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const currentThread = await CommunityThread.find({
    subjectID: req.params.id
  }).sort({ createdAt: -1 });
  if (currentThread) {
    return res.status(200).json(currentThread);
  } else {
    return res.status(404).json({ message: "No thread found" });
  }
};

// Get one thread
const getCommunityThread = async (req: Request, res: Response) => {
  const condition = () => {
    if (mongoose.isValidObjectId(req.params.id)) {
      return { _id: new ObjectId(req.params.id) };
    }
  };

  CommunityThread.findOne(
    condition(),
    function (err: Error, communityThread: mongoose.Document) {
      if (!communityThread) {
        return res.status(404).json("Thread does not exist");
      }
      if (err) {
        return res.status(500).send(console.error());
      }
      return res.status(200).json({ communityThread });
    }
  );
};

// Create a new thread
const createCommunityThread = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.id);
  if (user) {
    const { title, createdAt } = req.body;
    const newCommunityThread = new CommunityThread({
      subjectID: req.params.id,
      title: title,
      user: user.id,
      username: user.username,
      createdAt: createdAt,
    });
    await CommunitySubject.findByIdAndUpdate(req.params.id, {
      $push: { threads: newCommunityThread },
    });

    const savedCommunityThread = await newCommunityThread.save();

    if (savedCommunityThread) {
      res.status(201).json({ message: "Thread created successfully" });
    }
  } else {
    res.status(404).json({ message: "Thread not created" });
  }
};

export { createCommunityThread, getCommunityThreads, getCommunityThread };
