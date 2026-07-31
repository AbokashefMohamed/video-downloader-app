# start from official Node.js 20 on Debian slim — small but has apt package manager
FROM node:20-slim

# install system dependencies
# python3 and pip — needed to run yt-dlp and install curl_cffi
# ffmpeg — needed to merge video and audio streams
# wget — needed to download yt-dlp binary
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# install yt-dlp and curl_cffi via pip
# curl_cffi — needed for Vimeo, TikTok and other platforms that need browser impersonation
# yt-dlp — the actual download engine
RUN pip3 install yt-dlp curl_cffi --break-system-packages

# set working directory inside the container
WORKDIR /app

# copy package files first — Docker caches this layer
# so npm install only reruns when package.json changes
COPY package*.json ./

# install Node.js dependencies
# --ignore-scripts skips postinstall (we handle yt-dlp separately above)
RUN npm install --ignore-scripts

# copy all remaining backend files
COPY . .

# create tmp_downloads directory
RUN mkdir -p tmp_downloads

# expose port 3000 so Render can route traffic to it
EXPOSE 3000

# start the server
CMD ["npm", "start"]