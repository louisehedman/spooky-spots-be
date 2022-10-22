import mongoose, { ObjectId, Schema } from "mongoose";

// Declare GhostType type
interface IGhostType {
    type: string;
    description: string;
}

// Define GhostType schema
const GhostTypeSchema: Schema = new Schema<IGhostType>({
    type: {
        type: String,
        unique: true,
        index: true,
        required: [true, "Can't be blank"]
    },
    description: {
        type: String,
        required: [true, "Can't be blank"]
    }
})

const GhostType = mongoose.model<IGhostType>("GhostType", GhostTypeSchema);

export default GhostType;