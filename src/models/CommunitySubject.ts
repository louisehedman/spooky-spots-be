import mongoose, { Schema, Document, Types } from "mongoose";
import { ICommunityThread } from "./CommunityThread";

// Interface for CommunitySubject
export interface ICommunitySubject extends Document {
  title: string;
  threads: Types.DocumentArray<ICommunityThread>;
}

const CommunitySubjectSchema: Schema = new Schema({
  title: {
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
