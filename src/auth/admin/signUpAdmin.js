import { AdminModel } from "./../../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  validateEmail,
  isAllKeysHasValue,
  createRes,
  isAllRequiredKeyExist,
  validateAdminPassword,
} from "./../../utils/index.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

dotenv.config();

const signUpAdmin = async (req, res) => {
  const { email, password } = req.body;
  
  const isValidEmail= !validateEmail(email)
  const isPasswordValid = validateAdminPassword(password);
  const isRequiredKeysExist = isAllRequiredKeyExist(["name", "email", "password","phone"], req.body)
  const checkObjectKeysValue= !isAllKeysHasValue(req?.body).isValid

  
  if (!isRequiredKeysExist) { // if any key of body is empty
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, {required: [...isrequiredKeysExist]}));
  }
  
  if (checkObjectKeysValue) { // if any keys missing
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, isEmptyKey.emptyField + " is required"));
  }
  
  if (isValidEmail) { // if email not valid
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE,"Email " + ReasonPhrases.NOT_ACCEPTABLE));
  }
  
  if (!isPasswordValid.isValid) { // checking password validation
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, isPasswordValid.issues));
  }

  try {
    const { sign } = jwt;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const data = await new AdminModel({
      ...req.body,
      password: hash
    }).save();

    const token = sign({ _id: data._doc._id, type: data._doc.type }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    delete data._doc.password;
    delete data._doc.__v;

    res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, ReasonPhrases.OK, { ...data._doc, token }));

  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, "Email is already registered"));
    }

    // Handle other validation errors
    if (error.name === "ValidationError") {
      let messages = [];
      for (let field in error.errors) {
        messages.push(error.errors[field].message);
      }
      return res.status(StatusCodes.BAD_REQUEST).json(createRes(StatusCodes.BAD_REQUEST, messages.join(", ")));
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR,ReasonPhrases.INTERNAL_SERVER_ERROR));
  }
};
export default signUpAdmin;
