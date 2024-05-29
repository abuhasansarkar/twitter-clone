import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    const jwtAccessToken = req.cookies.jwtToken;

    // console.log(jwtAccessToken);
    
    if (!jwtAccessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized, Please SinIn First" });
    }

    const jwtTokenDecoded = jwt.verify(
      jwtAccessToken,
      process.env.JWT_SECRET_KEY
    );

    if (!jwtTokenDecoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized and Invalid Token" });
    }

    const user = await User.findById(jwtTokenDecoded.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User in not found !" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
};
