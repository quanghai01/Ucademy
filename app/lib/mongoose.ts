import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

export const connectToDatabase = async () => {
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not set");
  }

  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: "ucademy",
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
