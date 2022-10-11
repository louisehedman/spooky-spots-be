import mongoose, { Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator"
import bcrypt from 'bcryptjs';
import { ISpookySpotListItem, SpookySpotListItemSchema } from './SpookySpotListItem';

interface IUser {
    isModified(arg: string): any;
    matchPassword(password: string): boolean | PromiseLike<boolean>;
    resetPasswordToken: string|undefined;
    resetPasswordExpire: string|undefined;
    username: string;
    avatar?: string;
    password: string;
    email: string;
    isAdmin: boolean;
    spookySpotList: Types.DocumentArray<ISpookySpotListItem>
    posts?: Array<object>;
}

const UserSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Can't be blank"],
        unique: true,
        index: true,
    },
    avatar: {
        type: String,
        default: "",
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
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid email address'],
        unique: true,
        index: true
    }, 
    isAdmin: {
        type: Boolean, 
        default: false,
    },
    spookySpotList: {
        type: [SpookySpotListItemSchema],
        required: false

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
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hashSync(this.password, salt); 
    next();
});

UserSchema.methods.matchPassword = async function (password:string) {
    return await bcrypt.compare(password,this.password)   
}

UserSchema.plugin(uniqueValidator, {message: "{PATH} already exists"});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;