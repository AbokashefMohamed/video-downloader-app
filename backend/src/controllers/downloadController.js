import { spawnDownload } from "../download/spawnDownload.js";
import { saveToHistory } from "./historyController.js";
import { calculatePlaylistLimit } from "../middleware/downloadLimits.js";
import { probeUrl } from "../probe/index.js";
import { User } from "../models/User.js";
import { GuestDownload } from "../models/GuestDownload.js";
import { getOrCreateCookieId } from "../utils/cookie.js";

// handle Post api/download
export async function download(req, res) {
  const { url, type, isPlaylist, formatId, audioFormat, subLang } = req.body;
  
  // url type validation
  if (!url || !type) {
      return res.status(400).json({ message: "url and type are required" });
    }
    
    
    if (!["video", "audio", "subtitle"].includes(type)) {
        return res
        .status(400)
        .json({ message: "type must be video, audio or subtitle" });
    }
    // guests can't pick quality or format — force defaults
    const safeFormatId = req.userId ? formatId : null;
    const safeAudioFormat = req.userId ? audioFormat : "mp3";
    const safeSubLang = req.userId ? subLang : null;

  if (type === "subtitle" && !safeSubLang) {
  return res.status(400).json({ message: "subLang is required for subtitle downloads" });
}


  // mark loggin user as havin an active download
  if (req.userId) {
    await User.findByIdAndUpdate(req.userId, { activeDownload: true });
  }

  try {
    let playlistEnd = null;
    let title = null;
    let thumbnail = null;

    // get metadata and calculate playlist limits
    const probeResult = await probeUrl(url, { noPlaylist: !isPlaylist });

    if (isPlaylist && !req.userId) {
      // guest playlist calculate how many videos they're allowed
      const totalVideos = Array.isArray(probeResult) ? probeResult.length : 1;
      playlistEnd = calculatePlaylistLimit(totalVideos);
    }

    // extract title and thum from probe result
    if (Array.isArray(probeResult)) {
      // user first video info
      title = probeResult[0]?.title || null;
      thumbnail = probeResult[0]?.thumbnail || null;
    } else {
      title = probeResult.title || null;
      thumbnail = probeResult.thumbnail || null;
    }
    await spawnDownload({
      type,
      url,
      formatId: safeFormatId,
      audioFormat: safeAudioFormat,
      subLang: safeSubLang,
      playlistEnd,
      res,
    });

    // save to history after successfully download
    if (req.userId) {
      await saveToHistory(req.userId, {
        url,
        title,
        thumbnail,
        type,
        quality: safeFormatId || null,
        audioFormat: safeAudioFormat || null,
      });
    }

    // increment guest counters after successfully download
    if (!req.userId) {
      const ip = req.ip;
      const cookieId = getOrCreateCookieId(req, res);

      const guest =
        (await GuestDownload.findOne({ cookieId })) ||
        (await GuestDownload.findOne({ ip }));

      if (guest) {
        if (isPlaylist) {
          guest.playlistCount += 1;
          guest.lastPlaylistDownload = new Date();
        } else {
          guest.singleVideoCount += 1;
          guest.lastSingleVideoDownload = new Date();
        }
        await guest.save();
      }
    }

    // update loggedin user playlist timestamp
    if (req.userId && isPlaylist) {
      await User.findByIdAndUpdate(req.userId, {
        lastPlaylistDownload: new Date(),
      });
    }
  } catch (error) {
    console.error("[download] error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "Download failed" });
    }
  } finally {
    // always reset activevideo
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, { activeDownload: false });
    }
  }
}
