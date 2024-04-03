import bcrypt from "bcrypt";
import userData from "../Models/userSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

export const postRegister = async (request, response) => {
  try {
    // Get user inputs from request body
    const { name, contactNumber, gender, email, password } = request.body;

    // Check if user with the provided email already exists
    const existingUser = await userData.findOne({ email });

    // If the user exists, return error
    if (existingUser) {
      return response.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new userData({
      name,
      contactNumber,
      gender,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send success response
    response.status(200).json({
      message: "User registration successful",
      user: {
        name: savedUser.name,
        contactNumber: savedUser.contactNumber,
        gender: savedUser.gender,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (request, response) => {
  try {
    // Get username (email) and password from request body
    const { email, password } = request.body;

    // Check if the user is registered
    const existingUser = await userData.findOne({ email });

    // If user not found, return error
    if (!existingUser) {
      return response.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const matchingPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    // If password does not match, return error
    if (!matchingPassword) {
      return response.status(400).json({ message: "Invalid password" });
    }

    // Generate token if login successful
    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET);

    // Save token to user document
    await userData.updateOne(
      { email },
      { token: { id: token, createdAt: new Date() } }
    );

    // Send success response with token
    response.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in user:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const forgetPassword = async (request, response) => {
  try {
    // Get email from request body
    const { email } = request.body;

    // Check if the email is provided
    if (!email) {
      return response.status(400).json({ message: "Enter a valid Email" });
    }

    // Check if the email exists in the database
    const existingUser = await userData.findOne({ email });
    if (!existingUser) {
      return response.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(10).toString("hex");
    await userData.updateOne({ email }, { resetCode: token });

    // Construct reset URL with token
    const resetURL = `https://diet-suggestion-app-frontend.netlify.app/resetpassword/${encodeURIComponent(token)}`;
    
    // Construct email message
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Reset Password",
      html: `<p>Click <a href="${resetURL}"><strong>here</strong></a> to reset your password</p>`,
    };

    // Create a transporter object using SMTP transport
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Send mail
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending mail:", error);
        return response.status(500).json({ message: "Failed to send mail" });
      }
      console.log("Email sent:", info.response);
      response.status(200).json({ message: "Please check your email" });
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const ValidateResetCode = async (request, response) => {
  let code = request.params.code;
  try {
    userData.findOne({ resetCode: code }).then((records) => {
      // Has records ?
      if (records && records._doc) {
        response.status(200).json({ valid: true, msg: "Valid Reset" });
      } else {
        response.status(200).json({ valid: false, msg: "Invalid token" });
      }
    });
  } catch (error) {
    response.status(404).json({ msg: "Internal Server Error " });
  }
};

export const passwordReset = async (request, response) => {
  // Receive needed keys from request body
  const { email, newPassword, confirmPassword } = request.body;
  try {
    // Find user by email
    const user = await userData.findOne({ email });

    // If user not found, return error
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Check if newPassword and confirmPassword match and are not empty
    if (
      newPassword !== confirmPassword ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      return response
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userData.updateOne({ email }, { password: hashedPassword });

    // Response message
    response.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getValidateToken = async (request, response) => {
  let email = request.body.email;

  try {
    userData.findOne({ email }).then((records) => {
      // Has records ?
      if (records && records._doc) {
        let token = records._doc.token,
          tokenDate = new Date(token.createdAt),
          currentDate = new Date(),
          difference = currentDate - tokenDate,
          hours = difference / (1000 * 60 * 60);

        // Check if the token has expired
        if (hours > 1) {
          return response
            .status(400)
            .json({ valid: false, message: "Token has expired" });
        } else {
          response.status(200).json({ valid: true, message: "Valid token" });
        }
      } else {
        response.status(200).json({ valid: false, message: "Invalid token" });
      }
    });
  } catch (error) {
    response.status(404).json({ message: "Internal Server Error " });
  }
};
