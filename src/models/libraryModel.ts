import mongoose, { Schema, Document as MongoDocument } from "mongoose";
import ILibrary from "../interfaces/ILibrary";

const LibrarySchema = new Schema({

  id: { type: String, required: true },
  name: { type: String, required: true },
  owner_id: { type: String, required: true },
  cover_url: { type: String, default: null },
  creation_date: { type: Number, required: true }

});

export default mongoose.model<ILibrary & MongoDocument>("Library", LibrarySchema, "Libraries");