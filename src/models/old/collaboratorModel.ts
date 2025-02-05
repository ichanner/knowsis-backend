import mongoose, { Schema, Document as MongoDocument } from "mongoose";
import ICollaborator from "../interfaces/ICollaborator";

const CollaboratorSchema = new Schema({

  user_id: { type: String, required: true },
  library_id: { type: String, required: true }

});

export default mongoose.model<ICollaborator & MongoDocument>("Collaborator", CollaboratorSchema, "Collaborators");