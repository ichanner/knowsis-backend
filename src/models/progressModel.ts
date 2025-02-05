import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi'
import IProgress from "../interfaces/IProgress";
import IDocument from "../interfaces/IDocument";


class ProgressModel extends Model<IProgress> {}

export default (sequelize: Sequelize) => {

	const documentModel: ModelType = Container.get('documentModel')
	const userModel: ModelType = Container.get('userModel')


	ProgressModel.init(
	  
	  {
	  	user_id: {
	  	  type: DataTypes.STRING,
	  	  allowNull: false,
	  	  references: {
	  	    key: 'id',
	  	    model: userModel
	  	  },
	  	  onUpdate: 'CASCADE',
	  	  onDelete: 'CASCADE'
	  	},
	  	document_id: {
	  	  type: DataTypes.STRING,
	  	  allowNull: false,
	  	  references:{
	  	    key: 'id',
	  	    model: documentModel
	  	  },
	  	  onUpdate: 'CASCADE',
	  	  onDelete: 'CASCADE'
	  	},
	  	pages_read: {
	  	  type: DataTypes.BIGINT,
	  	  allowNull: false,
	  	  defaultValue: 0
	  	},
	  	chapters_read:{
	  	  type: DataTypes.INTEGER,
	  	  allowNull: true
	  	}
	  },

	  { sequelize, tableName: 'Progress' }
	)

	ProgressModel.sync({ force: false })

	return ProgressModel
}
