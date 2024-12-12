import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  emailRegex,
  passwordRegex,
  dateRegex,
} from "../constants/index.js";
import { StatusCodes } from "http-status-codes";

dotenv.config();

// this function will help to create response
function createRes(status, message, data) {
  return {
    status,
    message,
    data,
  };
}

// for checking default success response
function checkReq(req, res) {
  return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, "Hi, Sharjeel api is runnnig correctly on this port ==> 3000 😃"));
}

// is email validate
const validateEmail = (email) => {
  return emailRegex.test(email);
};

// is password validate
function validatePassword(password) {
  if (!passwordRegex.test(password)) {
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (password.length > 25) {
      return "Password must be at most 25 characters long.";
    }
  }

  return true;
}

// Added password validation function that checks for length, uppercase, lowercase, number, and special character, returning specific issues if any.
function validateAdminPassword(password) {
  const issues = [];

  if (password.length < 8) {
    issues.push("Password must be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    issues.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    issues.push("Password must contain at least one lowercase letter.");
  }

  if (!/\d/.test(password)) {
    issues.push("Password must contain at least one number.");
  }

  if (!/[@$!%*?&]/.test(password)) {
    issues.push(
      "Password must contain at least one special character (@, $, !, %, *, ?, &)."
    );
  }
  return {
    isValid: issues.length === 0,
    issues: issues,
  };
}

// created a function which check is object jas email and password
function isAllRequiredKeyExist(requiredFields, obj) {
  const issues = requiredFields
    .filter((field) => !obj[field])
    .map(
      (field) =>
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
    );

  return (issues.length ? issues : false);
}

// is all keys of object are not (false == "")
const isAllKeysHasValue = (object) => {
  for (const key in object) {
    if (object[key] === "") {
      return { isValid: false, emptyField: key };
    }
  }
  return { isValid: true, emptyField: null };
};

// this function check is date in valid format like "DD MM YYYY"
function isValidDateFormat(dateString) {
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const [day, month, year] = dateString.split(" ").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  return true;
}

function convertDateFormat(date) { // date should be '10 12 2022'
  const [day, month, year] = date.split(' ');
  const convertedDate = new Date(`${year}-${month}-${day}`);
  return convertedDate
}

function creatHash(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function isNumberContainstring(str) {
  return !/^\d+$/.test(str);;
}

function getTokenVal(tokenVal) {
  const authToken = tokenVal.split(" ")[1];
  const extractedTokenVal = jwt.verify(authToken, process.env.JWT_SECRET);
  return extractedTokenVal
}


function decodeToken (token) {
  if (!token) return 'Token is required'

  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
      return decoded;
  }
  return false
}


export {
  decodeToken,
  validateEmail,
  validatePassword,
  isAllKeysHasValue,
  createRes,
  checkReq,
  validateAdminPassword,
  isAllRequiredKeyExist,
  isValidDateFormat,
  creatHash,
  isNumberContainstring,
  convertDateFormat,
  getTokenVal,
};