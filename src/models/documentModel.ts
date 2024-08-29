import mongoose, { Schema, Document as MongoDocument } from "mongoose"
import IDocument from "../interfaces/IDocument"

const DocumentSchema = new Schema({

  id: { type: String, required: true },
  library_id: { type: String, required: true },
 // url: { type: String, required: true },
 // size: { type: Number, required: true },
  owner_id: { type: String, required: true },
  creation_date: { type: Number, required: true },
  has_chapters: { type: Boolean, default: false },
  name: { type: String, default: null },
  description: { type: String, default: null },
  author: { type: String, default: null },
  title: { type: String, default: null },
  tags: { type: [String], default: [] },
  cover_url: { type: String, default: null }, // Optional cover image URL
  pages_read: { type: Number, default: 0 },
  chapters_read: { type: Number, default: 0 },
  total_pages: { type: Number, default: null },
  total_chapters: { type: Number, default: null }

});

export default mongoose.model<IDocument & MongoDocument>("Document", DocumentSchema, "Documents")