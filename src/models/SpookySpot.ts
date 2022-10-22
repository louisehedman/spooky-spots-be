import mongoose, { Schema, Types } from "mongoose";

// Declare SpookySpot type
interface ISpookySpot {
  name: string;
  address: string;
  postalCode?: string;
  country: string;
  location: {
    type: {
      type: string;
    };
    coordinates: number[];
  };
  description: string;
  image?: string;
  createdAt: Date;
  rating: number;
  ghostTypes: Types.Array<object>;
}

// Define SpookySpot schema
const SpookySpotSchema: Schema = new Schema<ISpookySpot>({
  name: {
    type: String,
    unique: true,
    index: true,
    required: [true, "Can't be blank"],
  },
  address: {
    type: String,
    required: [true, "Can't be blank"],
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
    required: [true, "Can't be blank"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: { type: [Number], required: true },
  },
  description: {
    type: String,
    required: [true, "Can't be blank"],
  },
  image: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
  },
  ghostTypes: {
    type: [Object],
    default: undefined,
  },
});

const SpookySpot = mongoose.model<ISpookySpot>("SpookySpot", SpookySpotSchema);

export default SpookySpot;
