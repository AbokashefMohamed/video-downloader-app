import { Router } from "express";
import { register, login, getMe, updateProfile, deleteAccount } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.patch("/me/update", requireAuth, updateProfile);
router.delete("/me/delete", requireAuth, deleteAccount);

export default router;