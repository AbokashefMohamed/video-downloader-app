import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";
import { probeUrl } from "../api/probe";
import { downloadFile } from "../api/download";
import { ProbeResult } from "../types";
import {
  DownloadTypeSelector,
  DownloadType,
} from "../components/home/DownloadTypeSelector";
import { UrlInput } from "../components/home/UrlInput";
import { VideoInfo } from "../components/home/VideoInfo";
import { VideoSettings } from "../components/home/VideoSettings";
import { AudioSettings } from "../components/home/AudioSettings";
import { SubtitleSettings } from "../components/home/SubtitleSettings";
import { DownloadButton } from "../components/home/DownloadButton";
import { isValidUrl } from "../utils/validation";
import { AudioFormat } from "../components/home/AudioSettings";


export function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // form state
  const [url, setUrl] = useState("");
  const [type, setType] = useState<DownloadType>("video");
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [formatId, setFormatId] = useState<string | null>(null);
  const [audioFormat, setAudioFormat] = useState<AudioFormat>("mp3");
  const [subLang, setSubLang] = useState<string | null>(null);

  // ui state
  const [probeResult, setProbeResult] = useState<ProbeResult | null>(null);
  const [probing, setProbing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // reset settings when type changes
  function handleTypeChange(newType: DownloadType) {
    setType(newType);
    setFormatId(null);
    setSubLang(null);
    setError(null);
    setSuccess(false);
  }

  // reset probe result when url changes
  function handleUrlChange(newUrl: string) {
    setUrl(newUrl);
    setProbeResult(null);
    setError(null);
    setSuccess(false);
  }

  // probe the url to get video info
  async function handleProbe() {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError(t("errors.urlRequired"));
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError(t("errors.invalidUrl"));
      return;
    }

    setError(null);
    setProbeResult(null);
    setProbing(true);
    setFormatId(null);
    setSubLang(null);

    try {
      const result = await probeUrl(trimmedUrl);
      setProbeResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("common.error"));
      }
    } finally {
      setProbing(false);
    }
  }

  // trigger the actual download
  async function handleDownload() {
    const trimmedUrl = url.trim();
    if (!isValidUrl(trimmedUrl)) {
      setError(t("errors.invalidUrl"));
      return;
    }
    setError(null);
    setSuccess(false);
    setDownloading(true);

    try {
      await downloadFile({
        url: url.trim(),
        type,
        isPlaylist,
        formatId: formatId ?? undefined,
        audioFormat: type === "audio" ? audioFormat : undefined,
        subLang: type === "subtitle" && subLang ? subLang : undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("common.error"));
      }
    } finally {
      setDownloading(false);
    }
  }

  // download button is disabled when subtitle type but no language selected
  const downloadDisabled = type === "subtitle" && isAuthenticated && !subLang;

  return (
    <div className="max-w-2xl mx-auto">
      {/* hero section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {t("home.title")}
        </h1>
        <p className="text-white/60">{t("home.subtitle")}</p>
      </div>

      {/* main card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col gap-5">
        {/* download type selector */}
        <DownloadTypeSelector value={type} onChange={handleTypeChange} />

        {/* url input */}
        <UrlInput
          url={url}
          probing={probing}
          onChange={handleUrlChange}
          onProbe={handleProbe}
        />

        {/* error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* success message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-200 rounded-lg p-3 text-sm">
            ✓ Download started successfully!
          </div>
        )}

        {/* probe result section */}
        {probeResult && (
          <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
            {/* video info */}
            <VideoInfo result={probeResult} />

            {/* type-specific settings — only shown for logged-in users */}
            {type === "video" && (
              <VideoSettings
                formats={probeResult.formats}
                formatId={formatId}
                onChange={setFormatId}
              />
            )}

            {type === "audio" && (
              <AudioSettings
                audioFormat={audioFormat}
                onChange={setAudioFormat}
              />
            )}

            {type === "subtitle" && (
              <SubtitleSettings
                subtitles={probeResult.subtitles}
                subLang={subLang}
                onChange={setSubLang}
              />
            )}

            {/* download button */}
            <DownloadButton
              type={type}
              isPlaylist={isPlaylist}
              downloading={downloading}
              disabled={downloadDisabled}
              isAuthenticated={isAuthenticated}
              onPlaylistChange={setIsPlaylist}
              onDownload={handleDownload}
            />
          </div>
        )}
      </div>
    </div>
  );
}
