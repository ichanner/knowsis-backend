import mongoose, { Schema, Document as MongoDocument } from "mongoose";
import IUser from "../interfaces/IUser";

const UserSchema = new Schema({

  id: { type: String, required: true },
  name: { type: String, required: true },
  creation_date: { type: Number, required: true }
  
});

export default mongoose.model<IUser & MongoDocument>("User", UserSchema, "Users");