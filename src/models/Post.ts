import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IPost extends Document {
  _id: ObjectId;
  threadID: string;
  title: string;
  text: string;
  username: string;
  createdAt: Date;
  user: string;
}

const PostSchema: Schema = new Schema(
  {
    threadID: { type: Schema.Types.ObjectId, ref: "CommunityThread" },
    title: { type: String, required: true },
    text: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { collection: "posts" }
);
const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
