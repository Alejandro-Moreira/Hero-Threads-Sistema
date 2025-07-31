import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hero_threads"
    );
    console.log(
      `Database is connected on ${connection.host} - ${connection.port}`
    );
    return connection;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const migrateCedula = async () => {
  try {
    await connection();

    // Get the database instance
    const db = mongoose.connection.db;

    // Drop the unique index on cedula field
    console.log("Removing unique index from cedula field...");
    await db.collection("clientes").dropIndex("cedula_1");
    console.log("Unique index removed from cedula field");

    console.log("Migración de cedula completada exitosamente");
  } catch (error) {
    console.log("Error during migration:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

migrateCedula();
