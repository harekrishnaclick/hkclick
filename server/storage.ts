import { 
  type User, 
  type InsertUser, 
  type LeaderboardEntry, 
  type UpdateScore,
  leaderboardEntries 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leaderboard methods
  updatePlayerScore(data: UpdateScore): Promise<LeaderboardEntry>;
  getGlobalLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getCountryLeaderboard(country: string, limit?: number): Promise<LeaderboardEntry[]>;
  getTotalGlobalScore(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    // Not implemented for this app
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Not implemented for this app
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Not implemented for this app
    throw new Error("Not implemented");
  }

  async updatePlayerScore(data: UpdateScore): Promise<LeaderboardEntry> {
    // First try to find existing player
    const [existingPlayer] = await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.playerName, data.playerName))
      .limit(1);

    if (existingPlayer) {
      // Only update if new score is higher
      if (data.score > existingPlayer.score) {
        const [updatedPlayer] = await db
          .update(leaderboardEntries)
          .set({
            score: data.score,
            country: data.country || existingPlayer.country,
            updatedAt: new Date(),
          })
          .where(eq(leaderboardEntries.id, existingPlayer.id))
          .returning();
        return updatedPlayer;
      }
      return existingPlayer;
    } else {
      // Create new player entry
      const [newPlayer] = await db
        .insert(leaderboardEntries)
        .values({
          playerName: data.playerName,
          score: data.score,
          country: data.country || "XX",
        })
        .returning();
      return newPlayer;
    }
  }

  async getGlobalLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
    return await db
      .select()
      .from(leaderboardEntries)
      .orderBy(desc(leaderboardEntries.score))
      .limit(limit);
  }

  async getCountryLeaderboard(country: string, limit = 50): Promise<LeaderboardEntry[]> {
    return await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.country, country))
      .orderBy(desc(leaderboardEntries.score))
      .limit(limit);
  }

  async getTotalGlobalScore(): Promise<number> {
    const result = await db
      .select({ total: sql<number>`sum(${leaderboardEntries.score})` })
      .from(leaderboardEntries);
    return result[0]?.total || 0;
  }
}

export const storage = new DatabaseStorage();
