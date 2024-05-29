// SignUp
import User from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import mongoDB from "../db/connectMongo.js";

// SingUp Function
export const singUp = async (req, res) => {
  const { username, email, fullName, password } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format !" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "You must be enter your password 6 character plus !",
      });
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
    // console.log(hastPassword);

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
    res.status(400).json({ message: "Something is Wrong for SingUp System !" });
    console.log(error.message);
  }
};

// SignIn Function
export const singIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const isPasswordCurrect = await bcrypt.compareSync(
      password,
      user?.password
    );

    if (!user || !isPasswordCurrect) {
      return res
        .status(404)
        .json({ message: "Invalid Username Or Password !" });
    }
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      followers: user.followers,
      following: user.following,
      link: user.link,
      bio: user.bio,
    });
  } catch (error) {
    res.status(400).json({ message: "Something is Wrong for SingIn System !" });
    console.log(error.message);
  }
};

// SingOut Function
export const singOut = async (req, res) => {
  try {
    res.cookie("jwtToken", "", { mexAge: 0 });
    res.status(200).json({ message: "SingOut Successfully !" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something is Wrong for SingOut System !" });
    console.log(error.message);
  }
};
