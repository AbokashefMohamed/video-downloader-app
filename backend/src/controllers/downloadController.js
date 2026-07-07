import { spawnDownload } from "../download/spawnDownload.js";
import { saveToHistory } from "./historyController.js";
import { calculatePlaylistLimit } from "../middleware/downloadLimits.js";
import { probeUrl } from "../probe/index.js";
import { User } from "../models/User.js";
import { GuestDownload } from "../models/GuestDownload.js";
import { getOrCreateCookieId } from "../utils/cookie.js";

// handle POST /api/download
export async function download(req, res) {
  const { url, type, isPlaylist, formatId, audioFormat, subLang } = req.body;

  // basic validation
  if (!url || !type) {
    return res.status(400).json({ message: "url and type are required" });
  }

  if (!["video", "audio", "subtitle"].includes(type)) {
    return res.status(400).json({ message: "type must be video, audio or subtitle" });
  }

  // guests can't pick quality or format — force defaults
  const safeFormatId = req.userId ? formatId : null;
  const safeAudioFormat = req.userId ? audioFormat : "mp3";
  const safeSubLang = req.userId ? subLang : null;

  if (type === "subtitle" && !safeSubLang) {
    return res.status(400).json({ message: "subLang is required for subtitle downloads" });
  }

  // mark logged-in user as having an active download
  if (req.userId) {
    await User.findByIdAndUpdate(req.userId, { activeDownload: true });
  }

  // get guest cookie BEFORE streaming starts — can't set cookies after response begins
  const guestIp = !req.userId ? req.ip : null;
  const guestCookieId = !req.userId ? getOrCreateCookieId(req, res) : null;

  // declared outside try so background tasks can access them
  let title = null;
  let thumbnail = null;

  try {
    let playlistEnd = null;

    // probe first to get metadata and calculate playlist limits
    const probeResult = await probeUrl(url, { noPlaylist: !isPlaylist });

    if (isPlaylist && !req.userId) {
      const totalVideos = Array.isArray(probeResult) ? probeResult.length : 1;
      playlistEnd = calculatePlaylistLimit(totalVideos);
    }

    // extract title and thumbnail from probe result
    if (Array.isArray(probeResult)) {
      title = probeResult[0]?.title || null;
      thumbnail = probeResult[0]?.thumbnail || null;
    } else {
      title = probeResult.title || null;
      thumbnail = probeResult.thumbnail || null;
    }

    // streams the file — after this line response is already sent to browser
    await spawnDownload({
      type,
      url,
      formatId: safeFormatId,
      audioFormat: safeAudioFormat,
      subLang: safeSubLang,
      playlistEnd,
      res,
    });

  } catch (error) {
    console.error("[download] error:", error.message);
    // only send error response if streaming hasn't started yet
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "Download failed" });
    }
  } finally {
    // always reset activeDownload — even if something crashed
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, { activeDownload: false });
    }
  }

  // background tasks completely separate from streaming
  try {
    // save to history
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

    // increment guest download counter
    if (!req.userId) {
      const guest =
        (await GuestDownload.findOne({ cookieId: guestCookieId })) ||
        (await GuestDownload.findOne({ ip: guestIp }));

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
  } catch (bgError) {
    // log only never send a response here, streaming already finished
    console.error("[download] background task error:", bgError.message);
  }
}