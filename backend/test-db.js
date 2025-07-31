import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hero-threads';
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', mongoURI);
    
    const { connection } = await mongoose.connect(mongoURI);
    console.log(`✅ Database connected successfully on ${connection.host}:${connection.port}`);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      test: Boolean
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({
      name: 'Test Document',
      test: true
    });
    
    await testDoc.save();
    console.log('✅ Test document saved successfully');
    
    const foundDoc = await TestModel.findOne({ name: 'Test Document' });
    console.log('✅ Test document retrieved successfully:', foundDoc);
    
    await TestModel.deleteOne({ name: 'Test Document' });
    console.log('✅ Test document deleted successfully');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started');
    console.log('3. Verify the connection URI is correct');
    console.log('4. Try running: mongod --dbpath /path/to/data/db');
  }
};

testConnection(); 