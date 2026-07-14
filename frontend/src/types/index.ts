// shape of loggin user 
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}


// item in download history
export interface HistoryEntry {
  _id: string;
  url: string;
  title: string | null;
  thumbnail: string | null;
  type: "video" | "audio" | "subtitle";
  quality: string | null;
  audioFormat: string | null;
  createdAt: string;  
}

// get back from post api/probe
export interface ProbeResult {
  title: string;
  thumbnail: string | null;
  duration: number;
  webpage_url: string;
  formats: VideoFormat[];
  subtitles: Subtitle[];
}

// one quality option shown in quality picker
export interface VideoFormat {
  formatId: string;
  ext: string;
  resolution: string | null;
  filesize: number | null;
}

// one subtitle language shown in sub picker
export interface Subtitle {
  lang: string;
  name: string;
  isAuto: boolean;
}

// loggin and register endpoints return
export interface AuthResponse {
    token: string;
    user: User;
}

// shape of error res from backend
export interface ApiError {
  message: string;
  code?: string;
  details?: {field: string, message: string}[];
}


// send to post api/download
export interface DownloadRequest {
  url: string;
  type: "video" | "audio" | "subtitle";
  isPlaylist: boolean;
  formatId?: string;
  audioFormat?: string;
  subLang?: string;
}


export interface UpdateProfileDto {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}