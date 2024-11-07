import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
    _id: string;
    ownerId: string;
    name: string;
    uploadStatus: "pending" | "processing" | "success" | "failed";
    path?: string;
    key: string;
    createdAt: Date;
    updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
    {
        ownerId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        uploadStatus: {
            type: String,
            enum: ["pending", "processing", "success", "failed"],
            default: "pending",
        },
        path: {
            type: String,
        },
        key: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const File = mongoose.models.File || mongoose.model<IFile>("File", fileSchema);

export default File;
