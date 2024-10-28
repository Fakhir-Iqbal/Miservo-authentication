import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    gender: {
      type: String,
      enum:['male', 'female', 'other'],
      trim: true,
      default: 'male',
    },
    phone: {
      type: Number,
      default: null,
      required: true
    },
    type: {
      type: String,
      enum:['ADMIN', 'OPERATOR'],
      default: "ADMIN"
    }
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admin", dataSchema);

export default AdminModel;