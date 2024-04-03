import jwt from "jsonwebtoken";
import userData from "../Models/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

const authorizedUser = async (request, response, next) => {
  const token = request.header("Authorization");

  if (!token) {
    return response.status(401).json({ message: "Token is missing" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id; // Access user ID from decoded token
    const user = await userData.findById(userId); // Fetch user from database using ID

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    request.user = user; // Storing the user object in request.user
    next(); // Move to next middleware
  } catch (error) {
    console.error("Error verifying token:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export default authorizedUser;
