import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserModel } from "./../../models/index.js";
import { createRes } from "./../../utils/index.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

dotenv.config();

const deleteUser = async (req, res) => {
  const { authorization } = req.headers;
  
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN));
  }
  
  const token = authorization.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json(createRes(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED));
  }

  const { _id } = payload;

  try {
    const user = await UserModel.findByIdAndDelete({ _id });
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(createRes(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
    }

    return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, 'Deleted user successfully'));

  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR,ReasonPhrases.INTERNAL_SERVER_ERROR));
  }
};
export default deleteUser;
