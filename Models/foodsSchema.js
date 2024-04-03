import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  foodsName: String,
  images: String,
  calories: Number,
  protein: Number,
  continent: String,
});
const Food = mongoose.model("Food", foodSchema);
export default Food;
