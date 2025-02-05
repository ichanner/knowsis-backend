import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi'
import ICollaborator from "../interfaces/ICollaborator";


class CollaboratorModel extends Model<ICollaborator> {}


export default (sequelize: Sequelize) => {

	const userModel: ModelType = Container.get('userModel');
	const libraryModel: ModelType = Container.get('libraryModel')

	CollaboratorModel.init(
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
	      onDelete: "CASCADE" 
	    }
	  }, 

	  { sequelize: sequelize, tableName: 'Collaborators' }
	)

	CollaboratorModel.sync({force: false })

	return CollaboratorModel;
}
