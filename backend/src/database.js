import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hero-threads';
    const { connection } = await mongoose.connect(mongoURI);
    console.log(
      `Database is connected on ${connection.host} - ${connection.port}`
    );
  } catch (error) {
    console.log('Database connection error:', error);
    console.log('Please make sure MongoDB is running on your system');
  }
};

export default connection;