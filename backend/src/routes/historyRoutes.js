import { Router } from "express";
import { getHistory, deleteHistoryEntry, clearHistory } from "../controllers/historyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getHistory);
router.delete("/", requireAuth, clearHistory);
router.delete("/:id", requireAuth, deleteHistoryEntry);


export default router;