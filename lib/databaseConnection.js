import mongoose from "mongoose";

// Register models used in populate() — Next.js route/server splits omit them otherwise.
import "@/models/Media.model";
import "@/models/Category.model";
import "@/models/Product.model";
import "@/models/ProductVariant.model";
import "@/models/User.model";
import "@/models/Order.model";
import "@/models/Review.model";
import "@/models/Coupon.model";
import "@/models/Otp.model";
import "@/models/Contact.model";
import "@/models/HomeGenderCollection.model";
import "@/models/HomeReelSection.model";

const MONGODB_URL = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

function isConnected() {
  return mongoose.connection?.readyState === 1;
}

export const connectDB = async () => {
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (isConnected() && cached.conn) {
    return cached.conn;
  }

  // Stale cache after disconnect
  if (cached.conn && !isConnected()) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        // Keep existing Atlas DB unless MONGODB_DB_NAME is set (URI path is the source of truth)
        ...(process.env.MONGODB_DB_NAME
          ? { dbName: process.env.MONGODB_DB_NAME }
          : {}),
        bufferCommands: true,
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
      })
      .then((conn) => {
        cached.conn = conn;
        return conn;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;

    // Wait until mongoose reports connected (serverless cold start)
    if (!isConnected()) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("MongoDB connection timed out"));
        }, 15000);

        const onConnected = () => {
          clearTimeout(timeout);
          mongoose.connection.off("error", onError);
          resolve();
        };
        const onError = (err) => {
          clearTimeout(timeout);
          mongoose.connection.off("connected", onConnected);
          reject(err);
        };

        if (isConnected()) {
          clearTimeout(timeout);
          resolve();
          return;
        }

        mongoose.connection.once("connected", onConnected);
        mongoose.connection.once("error", onError);
      });
    }

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
};

export function isRetryableDbError(error) {
  if (!error) return false;
  const name = error.name || "";
  const message = String(error.message || "").toLowerCase();
  return (
    name === "MongoServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoExpiredSessionError" ||
    name === "MongoNotConnectedError" ||
    name === "MongooseError" ||
    message.includes("buffering timed out") ||
    message.includes("connection") ||
    message.includes("timed out") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("schema hasn't been registered")
  );
}
