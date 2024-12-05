import { AdminModel } from "./../../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { compareSync } from "bcrypt";
import {
  validateEmail,
  isAllKeysHasValue,
  createRes,
  isAllRequiredKeyExist,
  validateAdminPassword,
} from "./../../utils/index.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

dotenv.config();

const loginAdmin = async (req, res) => {
  const { email, password, type } = req.body;

  const isValidEmail = !validateEmail(email);
  const isValidPassword = validateAdminPassword(password);
  const isRequiredjkeysExist = isAllRequiredKeyExist(["type", "email", "password"], req.body);
  const checkObjectKeysFilled = !isAllKeysHasValue(req?.body);

  if (isRequiredjkeysExist != null) { // if any key of body is empty
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, { required: [...isRequiredjkeysExist] }));
  }

  if (checkObjectKeysFilled.isValid) { // if any key of body is empty
    return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, isEmptyKey.emptyField + " is required"));
  }

  if (isValidEmail) { // if email not valid
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, "Email " + ReasonPhrases.NOT_ACCEPTABLE));
  }

  if (!isValidPassword.isValid) { // checking password validation
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, isValidPassword.issues));
  }

  try {
    const { sign } = jwt;

    const user = await AdminModel.findOne({ email, type });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(createRes(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
    } else {
      if (user && compareSync(password, user._doc.password)) {

        delete user.password;
        delete user.__v;
        delete data.type;


        const token = sign({ _id: user._doc._id, type: user.type }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, ReasonPhrases.OK, { ...user._doc, token }));
      } else {
        return res.send(createRes(StatusCodes.FORBIDDEN, "Invalid Password"));
      }
    }

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR));
  }
};
export default loginAdmin;
