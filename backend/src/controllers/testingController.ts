// typescript
import express from "express";
import Reservation from "../models/Reservation";
import Room from "../models/Room";
import User from "../models/User";

const router = express.Router();

router.post("/reset", async (req, res) => {
    if (process.env.NODE_ENV !== "test") {
        return res.status(403).json({ error: "Route allowed only in test environment" });
    }

    try {
        await Promise.all([
            Reservation.deleteMany({}),
            Room.deleteMany({}),
            User.deleteMany({})
        ]);
        return res.status(200).json({ message: "Database reset successful" });
    } catch (error) {
        console.error("Failed to reset database:", error);
        return res.status(500).json({ error: "Failed to reset database" });
    }
});

export default router;