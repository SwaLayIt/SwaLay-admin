import mongoose from "mongoose";
// import { createOptimizedIndexes } from "./indexes";

export async function connect() {
  try {
    // Check if there's already an active connection
    if (mongoose.connection.readyState === 1) {
      console.log("Using existing database connection");
      return mongoose.connection;
    }

    // Establish new connection with optimized settings
    const connection = await mongoose.connect(process.env.MONGODB_URI!, {
      // Connection Pool Settings - Increased for static generation
      maxPoolSize: 20, // Increased from 10 to handle more concurrent requests
      minPoolSize: 5, // Increased from 2 to maintain more connections
      waitQueueTimeoutMS: 30000, // Increased from 5000 to 30 seconds for static generation

      // Timeout Settings
      serverSelectionTimeoutMS: 10000, // Increased from 5000 to 10 seconds
      connectTimeoutMS: 30000, // Timeout for initial connection
      socketTimeoutMS: 45000, // Timeout for individual operations

      // Buffering Settings
      bufferCommands: false, // Disable command buffering

      // Replication/Sharding Settings
      retryWrites: true, // Auto-retry write operations
      retryReads: true, // Auto-retry read operations

      // Other Optimizations
      heartbeatFrequencyMS: 10000, // How often to check connection status
      autoIndex: false, // Automatic index creation (disable in production) defalut true
      maxIdleTimeMS: 120000, // Increased from 60000 to 120 seconds
    });

    // Get the connection instance
    const db = mongoose.connection;

    // Create indexes
    // ✅ SAFE: MongoDB won't recreate existing indexes
    // This will work in both development and production
    // if (process.env.CREATE_INDEXES === "true") {
    //     console.log("In DEVELOPMENT MODE");
    //   await createOptimizedIndexes();
    // }
    // Event listeners for connection status
    db.on("connected", () => {
      console.log("MongoDB successfully connected");
    });

    db.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      // Graceful shutdown on connection error
      process.exit(1);
    });

    db.on("disconnected", () => {
      console.warn("MongoDB connection lost");
    });

    return connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    // Exit with error code if initial connection fails
    process.exit(1);
  }
}
