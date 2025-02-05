import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi'
import IInvite from "../interfaces/IInvite";


class InviteModel extends Model<IInvite> {}


export default (sequelize: Sequelize) => {

	const libraryModel: ModelType = Container.get('libraryModel')

	 InviteModel.init(
	  {
	    code: {
	      type: DataTypes.STRING,
	      allowNull: false 
	    },
	    expiry:{
	      type: DataTypes.BIGINT,
	      allowNull: false
	    },
	    creation_date:{
	      type: DataTypes.BIGINT,
	      allowNull: false
	    },
	    library_id: {
	      type: DataTypes.STRING,
	      allowNull: false,
	      references:{
	        model: libraryModel,
	        key: 'id' 
	      },
	      onUpdate: "CASCADE",
	      onDelete: "CASCADE" 
	    }
	  }, 

	  { sequelize: sequelize, tableName: 'Invites' }
	)

	InviteModel.sync({force: false })

	return InviteModel;
}
