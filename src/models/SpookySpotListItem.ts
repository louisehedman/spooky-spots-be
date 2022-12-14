import { Schema } from "mongoose";
import { ObjectId } from "mongodb";

// Declare list item type
interface ISpookySpotListItem {
  _id: ObjectId;
  spookySpotId: ObjectId;
  hasVisited: boolean;
  comment: string;
}

// Define list item schema
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
        required: false,
        default: "",
      }
  });
  
  export { ISpookySpotListItem, SpookySpotListItemSchema};