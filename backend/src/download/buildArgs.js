import path from "path";
import { ALLOWED_AUDIO_FORMATS, FFMPEG_PATH } from "./config.js";

// build ytdlp argumant array based on what user wants to download
export function buildArgs({ type, url, outputPath, formatId, audioFormat, subLang, playlistEnd}) {

    // base args that apply to every download type
    const base = [
        "--ffmpeg-location", FFMPEG_PATH,
        "--no-warnings",
        "--newline",
        "-o", outputPath,
    ];

    // add playlist limit if one was calculated
    if (playlistEnd) {
        base.push("--playlist-end", String(playlistEnd));
    }

    if (type === "video") {
        // if user picked a specific format use it, otherwise default to 480p
        const format = formatId 
        ? `${formatId}+bestaudio/best` 
        : "bestvideo[height<=480]+bestaudio/best[height<=480]/bestvideo+bestaudio";

        return [
            ...base, "-f", format,
            "--merge-output-format", "mp4",
            url,
        ];
    }

    if (type === "audio") {
        // validate audio format fall back to mp3 if something invalid was sent
        const format = ALLOWED_AUDIO_FORMATS.includes(audioFormat) ? audioFormat : "mp3";


        return [
            ...base,
            "-x",
            "--audio-format", format,
            "--audio-quality", "0",
            url,
        ];
    }

    if (type === "subtitle") {
        return [
            ...base,
            "--write-subs",
            "--write-auto-subs",
            "--sub-lang", subLang,
            "--sub-format", "srt",
            "--skip-download",
            "--convert-subs", "srt",
            url,
        ];
    }

    throw new Error(`Unknown download type: ${type}`);
}