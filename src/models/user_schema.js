import mongoose, { Schema } from "mongoose";



const dataSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: Number,
      minlength: 11,
    },
    birthdate: {
      type: String,
      default: '00-00-0000',
    },
    city: {
      type: String,
      default: 'karachi',
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    address_1: {
      type: String,
    },
    address_2: {
      type: String,
    },
    checkInDuration: {
      type: String,
    },
    gender: {
      type: String,
      trim: true,
      default: 'male',
    },
    type: {
      type: String,
      index: true,
      default: "user"
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", dataSchema);

export default UserModel;
