import fs from "fs";
import path from "path";
import https from "https";

const BIN_DIR = path.join(process.cwd(), "bin");
const YTDLP_PATH = path.join(BIN_DIR, "yt-dlp.exe");
const DOWNLOAD_URL = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";

const MAX_REDIRECTS = 5;

// Ensures bin directory exists
function ensureBinDir() {
    if (!fs.existsSync(BIN_DIR)) {
        fs.mkdirSync(BIN_DIR, {recursive: true});
    }
}

// Safely removes a file if it exists
function safeRemove(filePath) {
    try {
        fs.unlinkSync(filePath);
    } catch (_) {}
}

// handles downloading a file with redirect
function downloadFile(url, destination, redirectCount = 0){
    if (redirectCount > MAX_REDIRECTS) {
    return Promise.reject(new Error("Too many redirects"));
}
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);

        https.get(url, (res) => {

            const { statusCode, headers } = res;

            // handle redirects
            if(statusCode === 302 || statusCode === 301) {
                file.close();
                safeRemove(destination);
                return downloadFile(headers.location, destination, redirectCount + 1)
                .then(resolve)
                .catch(reject);
            }
            // handle failed res
            if(statusCode !== 200) {
                file.close();
                safeRemove(destination);
                return reject(new Error(`Download failed with status: ${statusCode}`));

            }
            // Pipe res to file
            res.pipe(file);
            file.on("close", () => {
                resolve();
            });
        }).on("error", (err) => {
            file.close();
            safeRemove(destination);
            reject(err);
        });
    });
}

// main setup function
async function setup() {
    if (fs.existsSync(YTDLP_PATH)) {
        console.log("yt-dlp.exe already exists, skipping download");
        return;
    }

    ensureBinDir();

    console.log("Downloading yt-dlp... this may take a moment...please wait");

    try {
        await downloadFile(DOWNLOAD_URL, YTDLP_PATH);
        console.log("✓ yt-dlp.exe downloaded successfully");
    } catch (error) {
        console.error("✗ Failed to download yt-dlp:", error.message);
        process.exit(1);
    }
}


setup();