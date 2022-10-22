import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";
import { IPost } from "./Post";

// Declare CommunityThread type
export interface ICommunityThread extends Document {
  _id: ObjectId;
  subjectID: string;
  title: string;
  createdAt: Date;
  user: string;
  posts: Types.DocumentArray<IPost>;
}

// Define CommunityThread schema
const CommunityThreadSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  username: { type: String },
  subjectID: { type: Schema.Types.ObjectId, ref: "CommunitySubject" },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const CommunityThread = mongoose.model<ICommunityThread>(
  "CommunityThread",
  CommunityThreadSchema
);

export default CommunityThread;
