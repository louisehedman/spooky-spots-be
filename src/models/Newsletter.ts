import mongoose, { Schema } from "mongoose";

// Declare Newsletter type
interface INewsletter {
    subject: string;
    message: string;
    createdAt: Date;
}

// Define Newsletter schema
const NewsletterSchema: Schema = new Schema<INewsletter>({
    subject: {
        type: String,
        required: [true, "Can't be blank"]
    },
    message: {
        type: String,
        required: [true, "Can't be blank"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

const Newsletter = mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

export default Newsletter;