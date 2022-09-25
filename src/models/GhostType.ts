import mongoose, { ObjectId, Schema } from "mongoose";

interface IGhostType {
    type: string;
    description: string;
}

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