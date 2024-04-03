import Food from "../Models/foodsSchema.js";

export const postFoodsData = async (request, response) => {
  try {
    const foodsData = request.body; // Array of food objects

    // Insert data into the database
    const insertedFoods = await Food.insertMany(foodsData);

    response
      .status(200)
      .json({ message: "Foods data Added Successfully", data: insertedFoods });
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
};

export const getFoodsData = async (request, response) => {
  try {
    const foods = await Food.find();
    response
      .status(200)
      .json({ message: "Fetched data successful", data: foods });
  } catch (error) {
    console.log("Error:", error);
    response.status(500).send("Internal Server Error");
  }
};
