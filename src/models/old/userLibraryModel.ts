import mongoose, { Schema, Document as MongoDocument } from "mongoose";
import IUserLibrary from "../interfaces/IUserLibrary";

const UserLibrarySchema = new Schema({

  user_id: { type: String, required: true },
  library_id: { type: String, required: true }

});

export default mongoose.model<IUserLibrary & MongoDocument>("UserLibrary", UserLibrarySchema, "UserLibraries");