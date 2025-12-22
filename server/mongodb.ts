import { MongoClient, Db, Collection } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

let client: MongoClient;
let db: Db;

export interface MongoUser {
  _id?: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface MongoLeaderboardEntry {
  _id?: string;
  playerName: string;
  score: number;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function connectToMongoDB(): Promise<Db> {
  if (db) return db;
  
  client = new MongoClient(MONGODB_URI!, {
    tls: true,
    tlsAllowInvalidCertificates: false,
  });
  await client.connect();
  db = client.db('harekrishna');
  
  const usersCollection = db.collection<MongoUser>('users');
  await usersCollection.createIndex({ username: 1 }, { unique: true });
  
  const leaderboardCollection = db.collection<MongoLeaderboardEntry>('leaderboard');
  await leaderboardCollection.createIndex({ score: -1 });
  await leaderboardCollection.createIndex({ country: 1, score: -1 });
  await leaderboardCollection.createIndex({ playerName: 1 }, { unique: true });
  
  console.log('Connected to MongoDB successfully');
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectToMongoDB() first.');
  }
  return db;
}

export function getUsersCollection(): Collection<MongoUser> {
  return getDb().collection<MongoUser>('users');
}

export function getLeaderboardCollection(): Collection<MongoLeaderboardEntry> {
  return getDb().collection<MongoLeaderboardEntry>('leaderboard');
}

export async function closeMongoConnection(): Promise<void> {
  if (client) {
    await client.close();
  }
}
