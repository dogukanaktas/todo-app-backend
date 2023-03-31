import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("⚡️[database]", connect.connection.host, connect.connection.name);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
