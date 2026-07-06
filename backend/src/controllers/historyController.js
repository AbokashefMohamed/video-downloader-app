import mongoose from "mongoose";
import { History } from "../models/History.js";

// returns all download history entries for the loggedin user, newest first
export async function getHistory(req, res) {
  const history = await History.find({ user: req.userId }).sort({
    createdAt: -1,
  }).limit(100);

  res.json(history);
}

// Saves a download entry to the user's history
export async function saveToHistory(userId, {url, title, thumbnail, type, quality, audioFormat}) {
    
    if (!userId) {
        console.error("Cannot save history: missing user id");
        return;
    }
    try {
        await History.create({
            user: userId,
            url, 
            title,
            thumbnail,
            type,
            quality,
            audioFormat,
        });
    } catch (error) {
        console.error("Failed to save history entry:", error.message);
    }
}

// deletes a single history entry
export async function deleteHistoryEntry(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid history entry id" });
  }
  const entry = await History.findById(id);

  if (!entry) {
    return res.status(404).json({ message: "History entry not found" });
  }

  // make sure users can only delete their own entries, not someone else's
  if (entry.user.toString() !== req.userId) {
    return res
      .status(403)
      .json({ message: "Not allowed to delete this entry" });
  }

  await entry.deleteOne();
  res.json({ message: "History entry deleted" });
}

// clears the entire history for the loggedin user
export async function clearHistory(req, res) {
  const result = await History.deleteMany({ user: req.userId });

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: "History is already empty",
    });
  }

  res.json({ message: "History cleared" });
}
