import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type UpdateScore = z.infer<typeof updateScoreSchema>;
