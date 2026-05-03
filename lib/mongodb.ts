import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseCache: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
};

if (!globalWithMongoose._mongooseCache) {
  globalWithMongoose._mongooseCache = { conn: null, promise: null };
}

const cached = globalWithMongoose._mongooseCache;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
