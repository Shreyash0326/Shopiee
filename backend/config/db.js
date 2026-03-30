import mongoose from 'mongoose';

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_mongodb_atlas_connection_string')) {
      throw new Error('Invalid MONGO_URI. Please provide a valid MongoDB Atlas connection string in the Secrets panel.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose runtime error: ${err.message}`);
});

export default connectDB;
