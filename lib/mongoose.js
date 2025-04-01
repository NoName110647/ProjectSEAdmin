import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing. Please check your .env.local file.");
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
} else {
    console.log("🔍 MONGODB_URI Loaded:", MONGODB_URI);
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function mongooseConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        console.log("🔄 Connecting to MongoDB...");
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // ตั้งค่า timeout 5 วินาที
        }).then((mongoose) => {
            console.log("✅ MongoDB Connected!");
            return mongoose;
        }).catch((error) => {
            console.error("❌ MongoDB Connection Error:", error);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        throw new Error("MongoDB connection failed");
    }
}