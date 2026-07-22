import mongoose from "mongoose";
import jwt from "jsonWebToken";

export class UserController {
  static async register(req, res, next) {
    try {
      const { username, phone } = req.body;

      //   TODO data validation

      const user = await mongoose.findOne({ username });
      let statusCode = 200;

      if (!user) {
        await mongoose.create({ username, phone });
        statusCode = 201;
      }

      const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "2d" });

      //   res.cookie("token", token, {
      //     httponly: true,
      //     signed: true,
      //     maxage: 1000 * 60 * 15,
      //   });

      return res.status(statusCode).json({
        message: "User Authenticated Successfully",
        token,
      });
    } catch (err) {
      next(err);
    }
  }
  static login(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }
}
