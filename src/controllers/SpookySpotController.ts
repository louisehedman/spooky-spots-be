import { Response, Request } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import SpookySpot from "../models/SpookySpot";
import User from "../models/User";

// Add spooky spot
const createSpookySpot = async (req: Request, res: Response, next: any) => {
  try {
    const user = await User.findById(req.body.id);
    // Only admins are allowed to create SpookySpots
    if (user.isAdmin === true) {
    const spookySpot = await SpookySpot.create(req.body);
    spookySpot.save().then(() => {
      res.status(201).json({ message: "Spooky spot created" });
    });
  }  else {
    res.status(400).json({ message: "You are not allowed to create SpookySpots" });
  }
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// Get all spooky spots
const getAllSpookySpots = async (req: Request, res: Response) => {
  try {
    const spookySpots = await SpookySpot.find();

    if (spookySpots) {
      return res.status(200).json({
        success: true,
        spookySpots,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No spooky spots found",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// Get one spooky spot
const getSpookySpot = async (req: Request, res: Response) => {
  const condition = () => {
    if (mongoose.isValidObjectId(req.params.spookySpot)) {
      return { _id: new ObjectId(req.params.spookySpot) };
    } else {
      return { name: req.params.spookySpot };
    }
  };

  SpookySpot.findOne(
    condition(),
    function (err: Error, spookySpot: mongoose.Document) {
      if (!spookySpot) {
        return res.status(404).json("Spooky spot does not exist");
      }
      if (err) {
        return res.status(500).send(console.error());
      }
      return res.status(200).json({ spookySpot });
    }
  );
};

// Delete spooky spot
const deleteSpookySpot = async (req: Request, res: Response) => {
  const condition = () => {
    if (mongoose.isValidObjectId(req.params.spookySpot)) {
      return { _id: new ObjectId(req.params.spookySpot) };
    }
  };

  SpookySpot.findOneAndDelete(
    condition(),
    function (err: Error, spookySpot: mongoose.Document) {
      if (!spookySpot) {
        return res.status(404).json("Spooky spot does not exist");
      }
      if (err) {
        return res.status(500).send(console.error());
      }
      return res.status(200).json("Spooky spot deleted");
    }
  );
};

export { createSpookySpot, getAllSpookySpots, getSpookySpot, deleteSpookySpot };
