import { DataTypes, Model, Sequelize } from 'sequelize';
import IUser from "../interfaces/IUser"

class UserModel extends Model<IUser> {}

export default (sequelize: Sequelize) => {

	UserModel.init(
	  {
	   id: {
         type: DataTypes.STRING,
         primaryKey: true,
         allowNull: false
	   },
	   name: {
         type: DataTypes.STRING,
	     allowNull: false
	   },
	   name_vector: {
	     type: DataTypes.TSVECTOR,
	     defaultValue: sequelize.literal("to_tsvector('')"),
	     allowNull: false
	   },
	   email: {
	     type: DataTypes.STRING,
	     allowNull: false,
	     unique: true,
	     validate: {
	       isEmail: true
	     }
	   },
	   phone: {
	     type: DataTypes.STRING,
	     allowNull: false,
	     unique: true,
	     validate: {
	       is: /^[\d\-+() ]+$/,  // Regex to allow valid phone number formats
      	   len: [10, 15]  // Ensures reasonable phone number length
	     }
	   },
	   google_id: {
	     type: DataTypes.STRING,
	     unique: true,
	     allowNull: true
	   },
	   hash: {
	     type: DataTypes.STRING,
	     allowNull: true
	   },
	   avatar_url: {
	     type: DataTypes.STRING,
	     allowNull: true
	   },
	   bio: {
	     type: DataTypes.STRING,
	     allowNull: true
	   },
	   creation_date:{
	     type: DataTypes.BIGINT,
	     allowNull: false
	   }
	  },
	  { sequelize: sequelize, tableName: 'Users', 

	  	indexes: [

	  		{ fields: ['name_vector'], using: 'gin' }
	  	]
	  	
	  	
	  }
	)

	UserModel.sync({ force: false })

	return UserModel
}