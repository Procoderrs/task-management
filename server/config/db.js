import mongoose from 'mongoose';
const connectDb=async()=>{
  try {
    const connection=await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDb connected: ${connection.connection.host}`);
  } catch (error) {
    console.log('mongo db connnection failed', error.message);
    process.exit(1);
    
  }
}

export default connectDb;