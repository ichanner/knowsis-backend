import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi'
import IUserLibrary from "../interfaces/IUserLibrary"


class UserLibraryModel extends Model<IUserLibrary> {}

export default (sequelize: Sequelize) => {

	const userModel: ModelType = Container.get("userModel")
	const libraryModel: ModelType = Container.get("libraryModel")

	UserLibraryModel.init(
	  {
	   user_id: {
         type: DataTypes.STRING,
         allowNull: false,
         references:{
           model: userModel,
           key: 'id' 
         },
         onUpdate: "CASCADE",
         onDelete: "CASCADE"   
       },
	   library_id: {
         type: DataTypes.STRING,
	     allowNull: false,
	     references:{
	       model: libraryModel,
	       key: 'id'
	     },
	     onUpdate: "CASCADE",
	     onDelete: "CASCADE",
	     
	   }
	  },

	  { 
	  	sequelize: sequelize, 
	  	tableName: 'UserLibraries'
	  }
	)

	UserLibraryModel.sync({ force: false })

	return UserLibraryModel
}