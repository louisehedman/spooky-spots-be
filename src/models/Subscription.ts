import mongoose, { Schema } from "mongoose";

// Declare Subscription type
interface ISubscription {
    email: string;
}

// Define Subscription schema
const SubscriptionSchema: Schema = new Schema<ISubscription>({
    email: {
        type: String,
        unique: true,
        index: true,
        required: [true, "Can't be blank"]
    }
})

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;