import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  updateScoreSchema,
  createAccountSchema,
  loginSchema,
  setPasswordSchema
} from "@shared/schema";
import { sendVerificationEmail, generateVerificationToken } from "./email";
import { hashPassword, comparePasswords } from "./auth";
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

  // Authentication routes
  app.post('/api/auth/create-account', async (req, res) => {
    try {
      const { username, email } = createAccountSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      
      // Generate verification token
      const token = generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      // Store email token
      await storage.createEmailToken({ email, username, token, expiresAt });
      
      // Send verification email
      const emailSent = await sendVerificationEmail(email, username, token);
      if (!emailSent) {
        console.warn('Email sending failed, but continuing with account creation process');
        // For development, we'll store the token but skip email sending
        return res.json({ 
          message: 'Account creation initiated. For development: use this verification link',
          developmentLink: `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${token}`
        });
      }
      
      res.json({ message: 'Verification email sent' });
    } catch (error) {
      console.error('Create account error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        return res.status(400).send('Invalid token');
      }
      
      const emailToken = await storage.getEmailToken(token);
      if (!emailToken) {
        return res.status(400).send('Invalid or expired token');
      }
      
      if (emailToken.expiresAt < new Date()) {
        await storage.deleteEmailToken(token);
        return res.status(400).send('Token expired');
      }
      
      // Redirect to password setup page with token
      res.redirect(`/?token=${token}&step=set-password`);
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  app.post('/api/auth/set-password', async (req, res) => {
    try {
      const { token, password } = setPasswordSchema.parse(req.body);
      
      const emailToken = await storage.getEmailToken(token);
      if (!emailToken) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      
      if (emailToken.expiresAt < new Date()) {
        await storage.deleteEmailToken(token);
        return res.status(400).json({ error: 'Token expired' });
      }
      
      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username: emailToken.username,
        email: emailToken.email,
        password: hashedPassword,
        emailVerified: new Date(),
      });
      
      // Clean up token
      await storage.deleteEmailToken(token);
      
      res.json({ 
        message: 'Account created successfully',
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error) {
      console.error('Set password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (!user.emailVerified) {
        return res.status(401).json({ error: 'Email not verified' });
      }
      
      const isValidPassword = await comparePasswords(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      res.json({
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
