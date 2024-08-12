import mongoose from "mongoose";

const mongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    // console.log(conn.connection.host);
    console.log("MongoDB Succesfuly Connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default mongoDB;
