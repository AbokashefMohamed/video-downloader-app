import { Router } from "express";
import { download } from "../controllers/downloadController.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { checkGuestSingleVideoLimit } from "../middleware/downloadLimits.js";
import { checkGuestPlaylistLimit } from "../middleware/downloadLimits.js";
import { requireNoActiveDownload } from "../middleware/downloadLimits.js";
import { requirePlaylistCooldown } from "../middleware/downloadLimits.js";


const router = Router();


router.post("/",
    optionalAuth,
    checkGuestSingleVideoLimit,
    checkGuestPlaylistLimit,
    requireNoActiveDownload,
    requirePlaylistCooldown,
    download
);


export default router;