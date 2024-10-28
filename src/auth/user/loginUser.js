import { UserModel } from "./../../models/index.js";
import {
  validateEmail,
  validatePassword,
  isAllKeysHasValue,
  createRes,
  isAllRequiredKeyExist,
} from "./../../utils/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { compareSync } from "bcrypt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

dotenv.config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const checkObjectAllKeys = !isAllKeysHasValue(req.body)
  const isValidEmail = !validateEmail(email)
  const isValidPassword = !validatePassword(password)
  const isRequiredKeysExist = isAllRequiredKeyExist(["email", "password"], req.body)

  if (checkObjectAllKeys) { // if any key of body is empty
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, isEmptyKey.emptyField + " is required"));
  }

  if (isRequiredKeysExist) { // if any key of body is empty
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, { required: [...isRequiredKeysExist] }));
  }


  if (isValidEmail) {  // if email not valid
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, "Email " + ReasonPhrases.NOT_ACCEPTABLE));
  }
  if (isValidPassword) {  // checking password validation
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, isPasswordValid));
  }

  try {
    const { sign } = jwt;

    const user = await UserModel.findOne({ email }).select("-__v"); // type: 'user'  need to add

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(createRes(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
    } else {
      if (compareSync(password, user.password)) {

        const token = sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        delete user._doc.type;
        delete user._doc.password;
        delete user._doc.gender;

        return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, ReasonPhrases.OK, { ...user._doc, token }));
      } else {
        return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, "Invalid Password"));
      }
    }

  } catch (error) {
    if (error.message) return res.status(StatusCodes.BAD_REQUEST).json(createRes(StatusCodes.BAD_REQUEST, error.message));
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR));
  }
};
export default loginUser;
