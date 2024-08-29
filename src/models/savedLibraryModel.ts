import mongoose, { Schema, Document as MongoDocument } from "mongoose";
import ISavedLibrary from "../interfaces/ISavedLibrary";

const SavedLibrarySchema = new Schema({

  user_id: { type: String, required: true },
  library_id: { type: String, required: true }

});

export default mongoose.model<ISavedLibrary & MongoDocument>("SavedLibrary", SavedLibrarySchema, "SavedLibraries");