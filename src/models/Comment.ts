import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IComment extends Document {
  _id: ObjectId;
  postID: string;
  username: string;
  user: string;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  postID: { type: Schema.Types.ObjectId, ref: "Post" },
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
