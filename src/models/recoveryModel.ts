import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi'
import IRecovery from "../interfaces/IRecovery"

class RecoveryModel extends Model<IRecovery> {}

export default (sequelize: Sequelize) => {

	RecoveryModel.init(
	  {
	    key: {
	  	  type: DataTypes.STRING,
	  	  allowNull: false
	  	},
	  	login: {
	  	  type: DataTypes.STRING,
	  	  allowNull: false
	  	},
	  	expiry:{
	  	  type: DataTypes.BIGINT,
	  	  allowNull: false
	  	}
	  },
	  {
	  	sequelize: sequelize, tableName: "Recoveries"
	  }
	)

	RecoveryModel.sync({force: false})

	return RecoveryModel;
}