import { Router } from "express";
import { listUsers, adminUpdateUser, adminDeleteUser } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";


const router = Router();

router.get("/users", requireAuth, requireAdmin, listUsers);
router.patch("/users/:id", requireAuth, requireAdmin, adminUpdateUser);
router.delete("/users/:id", requireAuth, requireAdmin, adminDeleteUser);

export default router;