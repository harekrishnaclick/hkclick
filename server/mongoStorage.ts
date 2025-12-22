import { 
  getUsersCollection, 
  getLeaderboardCollection,
  MongoUser,
  MongoLeaderboardEntry
} from './mongodb';
import { hash, compare } from 'bcryptjs';
import { ObjectId } from 'mongodb';

export interface User {
  id: string;
  username: string;
}

interface UserInternal {
  id: string;
  username: string;
  passwordHash: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface UpdateScore {
  playerName: string;
  score: number;
  country?: string;
}

export interface IMongoStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validatePassword(username: string, password: string): Promise<User | null>;
  
  updatePlayerScore(data: UpdateScore): Promise<LeaderboardEntry>;
  getGlobalLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getCountryLeaderboard(country: string, limit?: number): Promise<LeaderboardEntry[]>;
  getTotalGlobalScore(): Promise<number>;
}

function toLeaderboardEntry(doc: MongoLeaderboardEntry & { _id: ObjectId }): LeaderboardEntry {
  return {
    id: doc._id.toString(),
    playerName: doc.playerName,
    score: doc.score,
    country: doc.country || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toUser(doc: MongoUser & { _id: ObjectId }): User {
  return {
    id: doc._id.toString(),
    username: doc.username,
  };
}

function toUserInternal(doc: MongoUser & { _id: ObjectId }): UserInternal {
  return {
    id: doc._id.toString(),
    username: doc.username,
    passwordHash: doc.passwordHash,
  };
}

export class MongoStorage implements IMongoStorage {
  async getUser(id: string): Promise<User | undefined> {
    const users = getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(id) as any });
    return user ? toUser(user as any) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = getUsersCollection();
    const user = await users.findOne({ username });
    return user ? toUser(user as any) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = getUsersCollection();
    const passwordHash = await hash(insertUser.password, 10);
    
    const result = await users.insertOne({
      username: insertUser.username,
      passwordHash,
      createdAt: new Date(),
    });
    
    return {
      id: result.insertedId.toString(),
      username: insertUser.username,
    };
  }

  async validatePassword(username: string, password: string): Promise<User | null> {
    const users = getUsersCollection();
    const user = await users.findOne({ username });
    
    if (!user) return null;
    
    const isValid = await compare(password, user.passwordHash);
    if (!isValid) return null;
    
    return toUser(user as any);
  }

  async updatePlayerScore(data: UpdateScore): Promise<LeaderboardEntry> {
    const leaderboard = getLeaderboardCollection();
    const now = new Date();
    
    const existingPlayer = await leaderboard.findOne({ playerName: data.playerName });
    
    if (existingPlayer) {
      if (data.score > existingPlayer.score) {
        await leaderboard.updateOne(
          { _id: existingPlayer._id },
          { 
            $set: { 
              score: data.score, 
              country: data.country || existingPlayer.country,
              updatedAt: now 
            } 
          }
        );
        const updated = await leaderboard.findOne({ _id: existingPlayer._id });
        return toLeaderboardEntry(updated as any);
      }
      return toLeaderboardEntry(existingPlayer as any);
    } else {
      const result = await leaderboard.insertOne({
        playerName: data.playerName,
        score: data.score,
        country: data.country || 'XX',
        createdAt: now,
        updatedAt: now,
      });
      
      const newEntry = await leaderboard.findOne({ _id: result.insertedId });
      return toLeaderboardEntry(newEntry as any);
    }
  }

  async getGlobalLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
    const leaderboard = getLeaderboardCollection();
    const entries = await leaderboard
      .find({})
      .sort({ score: -1 })
      .limit(limit)
      .toArray();
    
    return entries.map(entry => toLeaderboardEntry(entry as any));
  }

  async getCountryLeaderboard(country: string, limit = 50): Promise<LeaderboardEntry[]> {
    const leaderboard = getLeaderboardCollection();
    const entries = await leaderboard
      .find({ country })
      .sort({ score: -1 })
      .limit(limit)
      .toArray();
    
    return entries.map(entry => toLeaderboardEntry(entry as any));
  }

  async getTotalGlobalScore(): Promise<number> {
    const leaderboard = getLeaderboardCollection();
    const result = await leaderboard.aggregate([
      { $group: { _id: null, total: { $sum: '$score' } } }
    ]).toArray();
    
    return result[0]?.total || 0;
  }
}

export const mongoStorage = new MongoStorage();
