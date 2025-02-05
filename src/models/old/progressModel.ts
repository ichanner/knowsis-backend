import mongoose, { Schema, Document as MongoDocument } from "mongoose";
import IProgress from "../interfaces/IProgress";

const ProgressSchema = new Schema({

  user_id: { type: String, required: true },
  library_id: { type: String, required: true },
  pages_read: { type: Number, default: 0 },
  chapters_read: { type: Number, default: null }

});

export default mongoose.model<IProgress & MongoDocument>("Progress", ProgressSchema, "Progress");