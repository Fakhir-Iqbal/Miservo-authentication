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
import bcrypt from "bcrypt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

dotenv.config();

const createUser = async (req, res) => {

  const { email, password } = req.body;


  const isRequiredKeysExist = isAllRequiredKeyExist(["firstName", "lastName", "phoneNum", "email", "password"], req.body)

  const checkObjectKeysFilled = !isAllKeysHasValue(req?.body)
  const isValidEmail = !validateEmail(email)
  const isValidPassword = !validatePassword(password)


  if (isRequiredKeysExist) {
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, { required: [...isRequiredKeysExist] }));
  }

  if (checkObjectKeysFilled) {
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, isEmptyKey.emptyField + " is required"));
  }

  if (isValidEmail) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, "Email " + ReasonPhrases.NOT_ACCEPTABLE));
  }

  if (isValidPassword) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, isPasswordValid));
  }


  try {
    const { sign } = jwt;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const data = await new UserModel({
      ...req.body,
      password: hash,
    }).save();

    const token = sign({ _id: data._doc._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    delete data._doc.password;
    delete data._doc.__v;
    delete data._doc.type;
    delete data._doc.gender;

    return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, ReasonPhrases.OK, { ...data._doc, token }));
  } catch (error) {

    if (error.code === 11000) { // if email already exist
      return res.status(StatusCodes.BAD_REQUEST).json(createRes(StatusCodes.BAD_REQUEST, "Email is already registered"));
    }

    // if (error.name === "ValidationError") { // Handle other validation errors
    //   let messages = [];
    //   for (let field in error.errors) {
    //     messages.push(error.errors[field].message);
    //   }
    //   return res.status(StatusCodes.BAD_REQUEST).json(createRes(StatusCodes.BAD_REQUEST, messages.join(", ")));
    // }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR));
  }
};
export default createUser;
