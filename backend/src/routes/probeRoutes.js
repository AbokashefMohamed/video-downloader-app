import { Router } from "express";
import { probe } from "../controllers/probeController.js";
import { requireAuth } from "../middleware/auth.js";


const router = Router();

router.post("/", requireAuth, probe);


export default router;