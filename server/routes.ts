import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateScoreSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Leaderboard routes
  
  // Submit or update player score
  app.post("/api/leaderboard/score", async (req, res) => {
    try {
      const validatedData = updateScoreSchema.parse(req.body);
      const updatedEntry = await storage.updatePlayerScore(validatedData);
      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        console.error("Error updating score:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get global leaderboard
  app.get("/api/leaderboard/global", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const leaderboard = await storage.getGlobalLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get country leaderboard
  app.get("/api/leaderboard/country/:country", async (req, res) => {
    try {
      const { country } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const leaderboard = await storage.getCountryLeaderboard(country, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching country leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get total global score
  app.get("/api/leaderboard/total", async (req, res) => {
    try {
      const totalScore = await storage.getTotalGlobalScore();
      res.json({ totalScore });
    } catch (error) {
      console.error("Error fetching total score:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
