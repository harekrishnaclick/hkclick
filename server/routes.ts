import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./mongoStorage";
import { z } from "zod";

const updateScoreSchema = z.object({
  playerName: z.string().min(1).max(50),
  score: z.number().int().min(0),
  country: z.string().length(2).optional(),
});

const authSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(4).max(100),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = authSchema.parse(req.body);
      
      const existingUser = await mongoStorage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await mongoStorage.createUser(validatedData);
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = authSchema.parse(req.body);
      
      const user = await mongoStorage.validatePassword(validatedData.username, validatedData.password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Leaderboard routes
  
  // Submit or update player score
  app.post("/api/leaderboard/score", async (req, res) => {
    try {
      const validatedData = updateScoreSchema.parse(req.body);
      const updatedEntry = await mongoStorage.updatePlayerScore(validatedData);
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
      const leaderboard = await mongoStorage.getGlobalLeaderboard(limit);
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
      const leaderboard = await mongoStorage.getCountryLeaderboard(country, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching country leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get total global score
  app.get("/api/leaderboard/total", async (req, res) => {
    try {
      const totalScore = await mongoStorage.getTotalGlobalScore();
      res.json({ totalScore });
    } catch (error) {
      console.error("Error fetching total score:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
