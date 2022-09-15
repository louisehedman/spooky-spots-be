import mongoose, { Schema, Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator"
import bcrypt from 'bcryptjs';

interface IUser {
    isModified(arg: string): any;
    matchPassword(password: string): boolean | PromiseLike<boolean>;
    resetPasswordToken: string|undefined;
    resetPasswordExpire: string|undefined;
    username: string;
    avatar?: string;
    password: string;
    email: string;
    role: number;
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
    role: {
        type: Number, 
        default: 0,
    },
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

UserSchema.plugin(uniqueValidator);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;