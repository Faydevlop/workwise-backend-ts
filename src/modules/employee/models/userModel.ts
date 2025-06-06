import mongoose, { Document, model, Schema } from "mongoose";
import { IUser } from "../types/userModelTypes";

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department", // Refers to the Department model
    default: null
  },
  position: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  payroll: {type: Schema.Types.ObjectId, ref: "Payroll", default:null },
  employeeStatus: { type: String, required: true },
  password: { type: String, required: true },
  profileImageUrl: { type: String, default: null },
  projectAssigned: { type: Boolean, default: false },
});

const User = model<IUser>("User", UserSchema);

export default User;
