import * as fs from "fs";
import mongoose from "mongoose";
import { ErrorResponse } from "../utils/errorResponse";
import GhostType from "../models/GhostType";

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

  export { seedGhostTypes };
