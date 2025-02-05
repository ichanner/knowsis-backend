import { DataTypes, Sequelize, Model, ModelType } from 'sequelize'
import { Container } from 'typedi'
import IDocument from "../interfaces/IDocument"

class DocumentModel extends Model<IDocument>{}

export default (sequelize: Sequelize) => {

	const libraryModel: ModelType = Container.get('libraryModel')
	const userModel: ModelType = Container.get('userModel')

	console.log(libraryModel)

	DocumentModel.init(
	  {
		id: { 
		  type: DataTypes.STRING, 
		  primaryKey: true, 
		  allowNull: false 
		},
		library_id: { 
		  type: DataTypes.STRING, 
		  allowNull: false,
		  references: {
		  	key: 'id',
		  	model: libraryModel
		  },
		  onUpdate: "CASCADE",
		  onDelete: "CASCADE"
		},
		content_url: { 
		  type: DataTypes.STRING, 
		  allowNull: false 
		},
		title: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		author: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		description: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		owner_id: {
	 	  type: DataTypes.STRING,
	 	  allowNull: false,
	 	  references:{
	 	    key: 'id',
	 	    model: userModel
	 	  },
	 	  onUpdate: 'CASCADE',
	 	  onDelete: 'CASCADE'
		},
		title_vector: {
		  type: DataTypes.TSVECTOR,
		  defaultValue: sequelize.literal("to_tsvector('')"),
		  allowNull: false
		},
		author_vector: {
		  type: DataTypes.TSVECTOR,
		  defaultValue: sequelize.literal("to_tsvector('')"),
		  allowNull: false
		},
		description_vector: {
		  type: DataTypes.TSVECTOR,
		  defaultValue: sequelize.literal("to_tsvector('')"),
		  allowNull: false
		},
		tags: {
		  type: DataTypes.TSVECTOR,
		  defaultValue: sequelize.literal("to_tsvector('')"),
		  allowNull: false
		},
		cover_url:{
		  type: DataTypes.STRING,
		  allowNull: true
		},
		creation_date: {
		  type: DataTypes.BIGINT,
		  allowNull: false
		},
		has_chapters: {
		  type: DataTypes.BOOLEAN,
		  defaultValue: false
		},
		total_pages: {
		  type: DataTypes.BIGINT,
		  allowNull: true
		},
		total_chapters: {
		  type: DataTypes.INTEGER,
		  allowNull: true
		}
	  },

	  { sequelize, tableName: 'Documents',
	  
	  
	  indexes:[
	  
	  	{ fields: ['title_vector', 'author_vector', 'description_vector', 'tags'], using: 'gin' }
	  ]
	  
	  
	  }
	)

	DocumentModel.sync({ force: false })

	return DocumentModel;
}