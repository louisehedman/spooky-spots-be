import * as fs from "fs";
import mongoose from "mongoose";
import { ErrorResponse } from "../utils/errorResponse";
import GhostType from "../models/GhostType";
import SpookySpot from "../models/SpookySpot";
import CommunitySubject from "../models/CommunitySubject";

// Seed database with ghost types
const seedGhostTypes = async () => {
    const db = mongoose.connection;
    const ghostTypes = JSON.parse(
      fs.readFileSync(__dirname + "/ghosttypes.json", "utf-8")
    );
    try {
      await db
        .dropCollection("ghosttypes")
        .then(() => {
          console.log(`${db.name}.ghosttypes collection dropped`);
        })
        .then(() => {
          GhostType.insertMany(ghostTypes);
        });
      console.log(`${db.name}.ghosttypes collection created, documents inserted`);
    } catch (error) {
        return new ErrorResponse(error, 500);
    }
  }

  // Seed database with SpookySpots
  const seedSpookySpots = async () => {
    const db = mongoose.connection;
    const spookySpots = JSON.parse(
      fs.readFileSync(__dirname + "/spookyspots.json", "utf-8")
    );
    try {
      await db
        .dropCollection("spookyspots")
        .then(() => {
          console.log(`${db.name}.spookyspots collection dropped`);
        })
        .then(() => {
          SpookySpot.insertMany(spookySpots);
        });
      console.log(`${db.name}.spookyspots collection created, documents inserted`);
    } catch (error) {
        return new ErrorResponse(error, 500);
    }
  }

  // Seed database with community subjects
  const seedCommunitySubjects = async () => {
    const db = mongoose.connection;
    const communitySubjects = JSON.parse(
      fs.readFileSync(__dirname + "/communitysubjects.json", "utf-8")
    );
    try {
      await db
        .dropCollection("communitysubjects")
        .then(() => {
          console.log(`${db.name}.communitysubjects collection dropped`);
        })
        .then(() => {
          CommunitySubject.insertMany(communitySubjects);
        });
      console.log(`${db.name}.communitysubjects collection created, documents inserted`);
    } catch (error) {
        return new ErrorResponse(error, 500);
    }
  }

  export { seedGhostTypes, seedSpookySpots, seedCommunitySubjects };
