import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { accessTokenSecret } from "../config";
import { Roles } from "../constants";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied, token" });

  try {
    const decoded = jwt.verify(token, accessTokenSecret);

    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;

    const { userTypeId } = decoded;

    if (userTypeId !== Roles.Admin) {
      return res.status(401).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    ``;
  }
};

export const isSelfOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    // Verify the token
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;

    const { userId, userTypeId } = decoded;

    const requestedUserId = parseInt(req.params.id, 10);

    // Allow access if the user is an admin or accessing their own data
    if (userTypeId === Roles.Admin || userId === requestedUserId) {
      return next();
    }

    return res
      .status(403)
      .json({ error: "Access denied, not an admin or the owner" });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
