import mongoose, { Schema, Document, Types, ObjectId } from "mongoose";
import { ICommunityThread } from "./CommunityThread";

// Declare CommunitySubject type
export interface ICommunitySubject extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  threads: Types.DocumentArray<ICommunityThread>;
}

// Define CommunitySubject schema
const CommunitySubjectSchema: Schema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: "CommunityThread",
    },
  ],
});

const CommunitySubject = mongoose.model<ICommunitySubject>(
  "CommunitySubject",
  CommunitySubjectSchema
);

export default CommunitySubject;
