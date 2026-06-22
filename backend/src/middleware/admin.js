import { User } from "../models/User.js";

// requires the authenticated user to have the admin role
export async function requireAdmin(req, res, next) {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
        return res.status(403).json({message: "Admin access required"});
    }

    next();
}