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
    contactNumber: {
      type: Number,
      minlength: 11,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      trim: true,
      default: 'male',
    },
    type: {
      type: String,
      index: true,
      default: "user"
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", dataSchema);

export default UserModel;