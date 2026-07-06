import { Router } from "express";
import { probe } from "../controllers/probeController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, probe);


export default router;