import { AttorneyModel } from '../models/index.js';
import { createRes } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { decodeToken } from '../utils/index.js';

export default async function saveAttorney (req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const addedById = decodeToken(token);

    const attorneyData = {
      ...req.body,
      added: addedById,
    };

    const savedData = await AttorneyModel.create(attorneyData);

    return res
      .status(StatusCodes.OK)
      .json(createRes(StatusCodes.OK, 'Attorney saved successfully', savedData));
  } catch (error) {
    if (error.code === 11000) {
      res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, 'email already exist'));
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => ({
          field: err.path.replaceAll('`', ''),
          message: err.message.replaceAll('`', ''),
      }));
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, errors));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, error.message.replaceAll('`', ''), null));
  } 
};