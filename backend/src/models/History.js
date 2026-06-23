import { Schema, model } from "mongoose";

// Schema for storing each download in a user's history
const historySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            default: "Unknown title",
            trim: true,
        },
        thumbnail: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ["video", "audio", "subtitle"],
            required: true,
        },
        quality: {
            type: String,
            default: null,
        },
        audioFormat: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export const History = model("History", historySchema);