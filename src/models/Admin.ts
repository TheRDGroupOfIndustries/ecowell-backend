import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      // unique: true,
      required: false,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: { type: String, required: false },
    role: { type: String, required: true, default: "admin" },
    image: {
      type: String,
      required: true,
      default: "/assets/images/admin.png",
    },
    phone_number: {
      type: String,
      required: false,
      // unique: true
    },
  },
  { timestamps: true }
);

const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;
