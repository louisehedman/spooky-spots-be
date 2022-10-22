import mongoose, { Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  ISpookySpotListItem,
  SpookySpotListItemSchema,
} from "./SpookySpotListItem";

// Declare user type
interface IUser {
  isModified(arg: string): any;
  matchPassword(password: string): boolean | PromiseLike<boolean>;
  getResetPasswordToken(): string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  spookySpotList: Types.DocumentArray<ISpookySpotListItem>;
  posts?: Array<object>;
}

// Define user schema
const UserSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Can't be blank"],
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, "Please use minimum of 8 characters"],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Can't be blank"],
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please use a valid email address",
    ],
    unique: true,
    index: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  spookySpotList: {
    type: [SpookySpotListItemSchema],
    required: false,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

UserSchema.pre<IUser>("save", async function (next: any) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

UserSchema.plugin(uniqueValidator, { message: "{PATH} already exists" });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
