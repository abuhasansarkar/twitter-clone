// SignUp
import User from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

// SingUp Function
export const singUp = async (req, res) => {
  const { username, email, fullName, password } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format !" });
    }
    // Exits Username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(404)
        .json({ message: `This ${username} already taken !` });
    }

    // Exits User Email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(404).json({ message: `This ${email} already taken !` });
    }

    // Hash Password

    const hastPassword = await bcrypt.hashSync(password, 10);
    console.log(hastPassword);

    const newUser = new User({
      username,
      email,
      fullName,
      password: hastPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        followers: newUser.followers,
        following: newUser.following,
        link: newUser.link,
        bio: newUser.bio,
      });
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// SignIn Function
export const singIn = async (req, res) => {
  res.json("signUp router is running");
};

// SingOut Function
export const singOut = async (req, res) => {
  res.json("signOut router is running");
};
