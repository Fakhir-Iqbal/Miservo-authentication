import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  emailRegex,
  passwordRegex,
  adminPasswordRegex,
  dateRegex,
  fuelPrice,
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

function compareDates(issueDate, expiryDate) {
  if (!isValidDateFormat(issueDate) || !isValidDateFormat(expiryDate)) {
    return {
      valid: false,
      message: "One or both dates are in an invalid format",
    };
  }

  const [issueDay, issueMonth, issueYear] = issueDate.split(" ").map(Number);
  const [expiryDay, expiryMonth, expiryYear] = expiryDate
    .split(" ")
    .map(Number);

  const issue = new Date(issueYear, issueMonth - 1, issueDay);
  const expiry = new Date(expiryYear, expiryMonth - 1, expiryDay);

  if (issue > expiry) {
    return { valid: false, message: "Issue date is greater than expiry date" };
  }

  return { valid: true, message: "Dates are valid" };
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

async function getRoute(profile = 'bike', currentlocation, destination) {
  try {
    const query = new URLSearchParams({
      key: "b16b1d60-3c8c-4cd6-bae6-07493f23e589"
    }).toString();

    const resp = await fetch(
      `https://graphhopper.com/api/1/route?${query}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile: profile, // profile could be "car", "car_avoid_motorway", "car_avoid_ferry", "truck", "small_truck", "scooter", "foot", "racingbike", "mtb"
          points: [
            currentlocation,
            destination
          ],
          point_hints: ["Main Street", "High Street"],
          snap_preventions: [
            'motorway',
            'ferry',
            'tunnel'
          ],
          details: ['road_class', 'surface']
        })
      }
    );

    const data = await resp.json();
    return data
  } catch (e) {
    return e
  }
}

const vehicleData = [
  { type: 'edhi', efficiencyKmPerL: 10 / 3, costPerL: 283.79 },
  { type: 'aman', efficiencyKmPerL: 10 / 5, costPerL: 346.7 },
  { type: 'chipa', efficiencyKmPerL: 10 / 3, costPerL: 283.79 },
];

function calculateFuelAndFuelCost(distance = 5, vanType = 'edhi') {
  // distance should be in km
  const vehicle = vehicleData.find(
    elem => elem.type === vanType?.toLowerCase().trim()
  );
  const fuelRequired = distance / vehicle.efficiencyKmPerL;
  const fuelCost = fuelRequired * vehicle.costPerL;
  return {
    fuelRequired, fuelCost
  };
}


export {
  validateEmail,
  validatePassword,
  isAllKeysHasValue,
  createRes,
  checkReq,
  validateAdminPassword,
  isAllRequiredKeyExist,
  isValidDateFormat,
  compareDates,
  creatHash,
  isNumberContainstring,
  convertDateFormat,
  getTokenVal,
  getRoute,
  calculateFuelAndFuelCost,
};
