import { Schema, model } from "mongoose";

const guestDownloadSchema = new Schema(
    {
        // identifies the guest by ip address
        ip: {
            type: String,
            required: true,
            trim: true,
        },
        // identifies the guest by browser cookie
        cookieId: {
            type: String,
            required: true,
            trim: true,
        },
        // tracks single video downloads
        singleVideoCount: {
            type: Number,
            default: 0,
        },
        lastSingleVideoDownload: {
            type: Date,
            default: null,
        },
        // tracks playlist downloads
        playlistCount: {
            type: Number,
            default: 0,
        },
        lastPlaylistDownload: {
            type: Date,
            default: null,
        },
    },
    {timestamps: true}
);

// speeds up lookups and search by ip and cookieId on every request
guestDownloadSchema.index({ip: 1});
guestDownloadSchema.index({ cookieId: 1});

export const GuestDownload = model("GuestDownload", guestDownloadSchema);