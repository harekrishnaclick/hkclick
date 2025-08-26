import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    playerName: varchar("player_name", { length: 50 }).notNull(),
    score: integer("score").notNull().default(0),
    country: varchar("country", { length: 2 }).default("XX"), // ISO country code
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("leaderboard_score_idx").on(table.score.desc()),
    index("leaderboard_country_idx").on(table.country),
  ]
);

// Email verification tokens
export const emailTokens = pgTable("email_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  username: text("username").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  emailVerified: true,
});

export const createAccountSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const setPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).pick({
  playerName: true,
  score: true,
  country: true,
});

export const updateScoreSchema = z.object({
  playerName: z.string().min(1).max(50),
  score: z.number().int().min(0),
  country: z.string().length(2).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type EmailToken = typeof emailTokens.$inferSelect;
export type CreateAccount = z.infer<typeof createAccountSchema>;
export type Login = z.infer<typeof loginSchema>;
export type SetPassword = z.infer<typeof setPasswordSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type UpdateScore = z.infer<typeof updateScoreSchema>;
