import mongoose, { Schema, Document } from "mongoose";

// Interface for CommunitySubject
export interface ICommunitySubject extends Document {
  title: string;
};

const CommunitySubjectSchema: Schema = new Schema(
    {
        title: {
            type: String
        },
        threads: [
            {
              type: Schema.Types.ObjectId,
              ref: 'CommunityThread',
            },
          ],
    });

    const CommunitySubject = mongoose.model<ICommunitySubject>("CommunitySubject", CommunitySubjectSchema);

export default CommunitySubject;