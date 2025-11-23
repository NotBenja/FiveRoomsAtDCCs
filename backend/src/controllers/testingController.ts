// typescript
import express from "express";
import { config } from "../config/env";
import Reservation from "../models/Reservation";
import Room from "../models/Room";
import User from "../models/User";

const router = express.Router();

router.post("/reset", async (req, res) => {
    // Permite test Y development (para e2e)
    if (config.nodeEnv === "production") {
        return res.status(403).json({ error: "Route not allowed in production" });
    }

    try {
        await Promise.all([
            User.deleteMany({}),
            Room.deleteMany({}),
            Reservation.deleteMany({})
        ]);
        
        console.log('✓ Database reset successful');
        return res.status(204).end(); // 204 No Content (más apropiado)
    } catch (error) {
        console.error("Failed to reset database:", error);
        return res.status(500).json({ error: "Failed to reset database" });
    }
});

export default router;