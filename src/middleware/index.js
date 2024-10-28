import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createRes } from "../utils/index.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

dotenv.config();

export async function verifyToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN));
  }

  try {
    const authToken = authorization.split(" ")[1];

    const verified = jwt.verify(authToken, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        createRes(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
      );
  }
}

// admin verification
export async function verifyAdminToken(req, res, next) {
  const { authorization } = req.headers;

  // is authorization token exist
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json(createRes(StatusCodes.UNAUTHORIZED, "Authorization header is missing"));
  }

  // is token format is correct
  const parts = authorization.split(" ");
  
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(StatusCodes.UNAUTHORIZED).json(createRes(StatusCodes.UNAUTHORIZED, "Invalid token format"));
  }

  // destructured token
  const { 1: authToken } = parts;

  try {
    // verify token by jwt
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);

    if (verified?.type === "ADMIN" || verified?.type === "OPERATOR") {
      req.user = verified;
      next();
    } else {
      return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, "Access denied. Admins only"));
    }

  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json(createRes(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED));
  }
}
