import { Document as MongoDocument, Model } from "mongoose"
import IDocument from "../interfaces/IDocument"
import ILibrary from "../interfaces/ILibrary"

declare global {

	namespace Models{

		export type Document = Model<IDocument & Document>
		export type Library = Model< Document & ILibrary>
	}
}