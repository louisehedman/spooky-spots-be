import { Schema } from "mongoose";
import { ObjectId } from "mongodb";

interface ISpookySpotListItem {
  _id: ObjectId;
  spookySpotId: ObjectId;
  hasVisited: boolean;
  comment: string;
}

const SpookySpotListItemSchema: Schema = new Schema<ISpookySpotListItem>({
    spookySpotId: {
        type: ObjectId,
        unique: false,
        required: true,
      },
      hasVisited: {
        type: Boolean,
        unique: false,
        required: true,
      }, 
      comment: {
        type: String,
        default: "",
      }
  });
  
  export { ISpookySpotListItem, SpookySpotListItemSchema};