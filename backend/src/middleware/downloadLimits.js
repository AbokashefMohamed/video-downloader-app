import { GuestDownload } from "../models/GuestDownload.js";
import { User } from "../models/User.js";
import { getOrCreateCookieId } from "../utils/cookie.js";

const PLAYLIST_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours 
const SINGLE_VIDEO_WINDOW_MS = 24 * 60 * 60 * 1000; 
const GUEST_SINGLE_VIDEO_LIMIT = 5;
const GUEST_PLAYLIST_LIMIT = 2;
const PLAYLIST_FULL_THRESHOLD = 15;
const PLAYLIST_PERCENTAGE = 0.2;
const PLAYLIST_MAX_VIDEOS = 15;

// find or creats a guest record matching both ip and cookie
async function getOrCreateGuestRecord(ip, cookieId) {
    //try to find by cookie first
    let guest = await GuestDownload.findOne({ cookieId });

    if (!guest) {
        // no cookie try ip
        guest = await GuestDownload.findOne({ ip });
    }

    if (!guest) {
        // first time so guest create a new record
        guest = await GuestDownload.create({ ip, cookieId });
    }

    return guest;
}

// calculates how many videos a user is allowed to download from a playlist
export function calculatePlaylistLimit(totalVideos) {
    if(totalVideos < PLAYLIST_FULL_THRESHOLD) {
        return totalVideos;
    }

    return Math.min(Math.floor(totalVideos * PLAYLIST_PERCENTAGE),
    PLAYLIST_MAX_VIDEOS
    );
}

// checks guest single video download limit (5 per 24 hours, tracked by ip+cookie)
export async function checkGuestSingleVideoLimit(req, res, next) {
    // loggedin users skip this check entirely
    if (req.userId) {
        return next();
    }

    const ip = req.ip;
    const cookieId = getOrCreateCookieId(req, res);
    const guest = await getOrCreateGuestRecord(ip, cookieId);
    const now = Date.now();
    // check if 24 hours have passed since their last download
    if (guest.lastSingleVideoDownload) {
        const elapsed = now - guest.lastSingleVideoDownload.getDate();

        if(elapsed >= SINGLE_VIDEO_WINDOW_MS) {
             // if window expired reset their count
            guest.singleVideoCount = 0;
            guest.lastSingleVideoDownload = null;
            await guest.save();
        }
    }

    if(guest.singleVideoCount >= GUEST_SINGLE_VIDEO_LIMIT) {
        const elapsed = now - guest.lastSingleVideoDownload.getDate();
        const remaining = SINGLE_VIDEO_WINDOW_MS - elapsed;
        const hoursLeft = Math.ceil(remaining / (1000 * 60 * 60));

        return res.status(429).json({ 
            message: `You have reached the limit of ${GUEST_SINGLE_VIDEO_LIMIT} free downloads. Please wait ${hoursLeft} hour(s) or login for unlimited downloads.`,
            retryAfterMs: remaining,
        });
    }
    next();
}
// checks guest playlist download limit 2 attempts, then must login
export async function checkGuestPlaylistLimit(req, res, next) {
    const { isPlaylist } = req.body;

    // not a playlist so skip
    if(!isPlaylist) {
        return next();
    }

    //loggin users skip guest playlist check
    if(req.userId) {
        return next();
    }

    const ip = req.ip;
    const cookieId = getOrCreateCookieId(req, res);
    const guest = await getOrCreateGuestRecord(ip, cookieId);

    if (guest.playlistCount >= GUEST_PLAYLIST_LIMIT) {
        return res.status(401).json({
            message: "You have used your free playlist downloads. Please register or login to continue downloading playlists.",
            requireAuth: true,
        });
    }
    next();
}

// blocks the request if user already has an active download
export async function requireNoActiveDownload(req, res, next) {
    
    if(!req.userId) {
        return next();
    }

    const user = await User.findById(req.userId);
    if (user.activeDownload) {
        return res.status(429).json({ message: "You already have a download in progress. Please wait for it to finish."});
    }
    next();
}

// blocks playlist downloads if the user downloaded a playlist less than 6 hours
export async function requirePlaylistCooldown(req, res, next) {
    const { isPlaylist } = req.body;

    if (!isPlaylist || !req.userId) {
        return next();
    }
    
    const user = await User.findById(req.userId);

    if (user.lastPlaylistDownload) {
        const elapsed = Date.now() - user.lastPlaylistDownload.getTime();
        const remaining = PLAYLIST_COOLDOWN_MS - elapsed;

        if (remaining > 0) {
            const hoursLeft = Math.ceil(remaining / (1000 * 60 * 60));
            return res.status(429).json({ message: `You can download a playlist once every 6 hours. Please wait ${hoursLeft} more hour(s).`,
                retryAfterMs: remaining,
            });
        }
    }
    next();
}
