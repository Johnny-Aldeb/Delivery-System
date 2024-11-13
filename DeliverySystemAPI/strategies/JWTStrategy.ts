import jwt from "jsonwebtoken";
import { User } from "../models";
import { ACCESS_TOKEN_EXPIRATION_TIME } from "../constants";
import { accessTokenSecret } from "../config";

export class JWTStrategy {
  generateToken(user: User) {
    return jwt.sign(
      { userId: user.id, userTypeId: user.userTypeId },
      accessTokenSecret,
      { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME / 1000 }
    );
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, accessTokenSecret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
