import mongoose, { Schema, Types } from "mongoose";

interface ISpookySpot {
   name: string;
   address: string;
   postalCode?: string;
   country: string;
   latitude: number;
   longitude: number;
   description: string;
   image?: string;
   createdAt: Date;
   rating: number;
   ghostTypes: Types.Array<object>
}

const SpookySpotSchema: Schema = new Schema<ISpookySpot>({
    name: {
        type: String,
        unique: true,
        index: true,
        required: [true, "Can't be blank"]
    },
    address: {
        type: String,
        required: [true, "Can't be blank"]
    },
    postalCode: {
        type: String,
    },
    country: {
        type: String,
        required: [true, "Can't be blank"]
    },
    latitude: {
        type: Number,
        required: [true, "Can't be blank"]
    },
    longitude: {
        type: Number,
        required: [true, "Can't be blank"]
    },
    description: {
        type: String,
        required: [true, "Can't be blank"]
    },
    image: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
    },
    ghostTypes: {
        type: [Object], 
        default: undefined
    }
})

const SpookySpot = mongoose.model<ISpookySpot>("SpookySpot", SpookySpotSchema);

export default SpookySpot;