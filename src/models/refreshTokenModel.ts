import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi'
import IRefreshToken from "../interfaces/IRefreshToken"

class RefreshTokenModel extends Model<IRefreshToken> {}

export default (sequelize: Sequelize) => {

	const userModel: ModelType = Container.get('userModel')

	RefreshTokenModel.init(
	  {
	    token: {
	  	  type: DataTypes.STRING,
	  	  allowNull: false
	  	},
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
	  	expiry:{
	  	  type: DataTypes.BIGINT,
	  	  allowNull: false
	  	}
	  },
	  {
	  	sequelize: sequelize, tableName: "RefreshTokens"
	  }
	)

	RefreshTokenModel.sync({force: false})

	return RefreshTokenModel;
}