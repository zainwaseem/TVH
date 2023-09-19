import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/Centerglass")
    .then(() => console.log(`Datebase Connected`))
    .catch((error) => console.log(error.message));
};
export default connectDB;
