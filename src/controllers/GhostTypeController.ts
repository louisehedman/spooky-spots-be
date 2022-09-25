import { Response, Request } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import GhostType from "../models/GhostType";

// Add ghost type
const createGhostType = async (req: Request, res: Response, next: any) => {
  try {
    const ghostType = await GhostType.create(req.body);
    ghostType.save().then(() => {
      res.status(200).json({ message: "Ghost type created" });
    });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// Get all ghost types
const getAllGhostTypes = async (req: Request, res: Response) => {
  try {
    const ghostTypes = await GhostType.find();

    if (ghostTypes) {
      return res.status(200).json({
        success: true,
        ghostTypes,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No ghost types found",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// Get one ghost type
const getGhostType = async (req: Request, res: Response) => {
  const condition = () => {
    if (mongoose.isValidObjectId(req.params.ghostType)) {
      return { _id: new ObjectId(req.params.ghostType) };
    } else {
      return { type: req.params.ghostType };
    }
  };

  GhostType.findOne(
    condition(),
    function (err: Error, ghostType: mongoose.Document) {
      if (!ghostType) {
        return res.status(404).json("Ghost type does not exist");
      }
      if (err) {
        return res.status(500).send(console.error());
      }
      return res.status(200).json({ ghostType });
    }
  );
};

export { createGhostType, getAllGhostTypes, getGhostType };
