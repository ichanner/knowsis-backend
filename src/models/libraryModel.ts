//@ts-nocheck
import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi'
import ILibrary from "../interfaces/ILibrary"

class LibraryModel extends Model<ILibrary>{}

export default (sequelize: Sequelize) => {

  const userModel: ModelType = Container.get('userModel')
 
  LibraryModel.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name_vector: {
        type: DataTypes.TSVECTOR,
        defaultValue: sequelize.literal("to_tsvector('')"),
        allowNull: false
      },
      description_vector: {
        type: DataTypes.TSVECTOR,
        defaultValue: sequelize.literal("to_tsvector('')"),
        allowNull: false
      },
      owner_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          key: 'id',
          model: userModel
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cover_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      creation_date: {
        type: DataTypes.BIGINT, // Use BIGINT for storing timestamps as numbers
        allowNull: false,
      },

    },

    { sequelize, tableName: 'Libraries', 

     
      indexes: [

         { fields: ['name_vector', 'description_vector'], using: 'gin' }
      ],
      
      
      
      hooks:{

        afterCreate: async(library, options) => {

          const userLibraryModel = Container.get('userLibraryModel');
          const collaboratorModel = Container.get('collaboratorModel');

          await userLibraryModel.create({

            user_id: library.owner_id,
            library_id: library.id
         
          }, {transaction: options.transaction})


          await collaboratorModel.create({

            user_id: library.owner_id,
            library_id: library.id
        
          }, {transaction: options.transaction})

        }

      } 
    }
  );

  LibraryModel.sync({ force: false })

  return LibraryModel

 }

