//connecting to MongoDB

import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://viktorvelizarov1:mC9ATnzc0CaviHLW@cluster0.dv6rv5z.mongodb.net/crud_db");
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
