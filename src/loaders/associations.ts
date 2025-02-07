//@ts-nocheck
import { Sequelize } from "sequelize"

export default async(sequelize: Sequelize) => {

	 const { models } = sequelize;

  models.UserModel.hasMany(models.ProgressModel, { foreignKey: 'user_id'  })
  models.ProgressModel.belongsTo(models.UserModel, { foreignKey: 'user_id' })

  models.UserModel.hasMany(models.LibraryModel, { foreignKey: 'owner_id'  })
  models.LibraryModel.belongsTo(models.UserModel, { foreignKey: 'owner_id'  })

  models.UserModel.hasMany(models.DocumentModel, { foreignKey: 'owner_id'  })
  models.DocumentModel.belongsTo(models.UserModel, { foreignKey: 'owner_id'  })

  models.LibraryModel.hasMany(models.DocumentModel, { foreignKey: 'library_id' })
  models.DocumentModel.belongsTo(models.LibraryModel, { foreignKey: 'library_id' })

  models.DocumentModel.hasMany(models.ProgressModel, { foreignKey: 'document_id' })
  models.ProgressModel.belongsTo(models.DocumentModel, { foreignKey: 'document_id' })

  models.LibraryModel.belongsToMany(models.UserModel, {
    through: models.UserLibraryModel,
    foreignKey: 'library_id',
    as: "users"
  });

  models.UserModel.belongsToMany(models.LibraryModel, {
    through: models.UserLibraryModel,
    foreignKey: 'user_id',
  });

  models.LibraryModel.belongsToMany(models.UserModel, {
    through: models.CollaboratorModel,
    foreignKey: 'library_id',
  });

  models.UserModel.belongsToMany(models.LibraryModel, {
    through: models.CollaboratorModel,
    foreignKey: 'user_id',
  });


  models.UserModel.hasMany(models.RefreshTokenModel, { foreignKey: 'user_id '});
  models.RefreshTokenModel.belongsTo(models.UserModel, { foreignKey: 'user_id '});


  models.LibraryModel.hasMany(models.InviteModel, { foreignKey: 'library_id '});
  models.InviteModel.belongsTo(models.LibraryModel, { foreignKey: 'library_id '});


  models.UserModel.hasMany(models.CourseworkProgressModel, { foreignKey: "user_id" });
  models.CourseworkProgressModel.belongsTo(models.UserModel, { foreignKey: "user_id" });

  models.DocumentModel.hasMany(models.CourseworkProgressModel, { foreignKey: "document_id" });
  models.CourseworkProgressModel.belongsTo(models.DocumentModel, { foreignKey: "document_id" });



/*

await models.ProgressModel.create({

  document_id: "91042394-1edc-4434-8d44-67e71ce1ee9a",
  user_id: '124'

})

 await models.UserModel.create({

    id: '124',                // Unique identifier for the user
    name: 'Amy Doe',          // Name of the user
    email: 'amydoe@example.com',  // Email of the user (must be unique)
    phone: '+1244567890',      // Optional: Phone number of the user (if unique)
    hash: 'hashed_password_here',  // Hashed password (if using password auth)
    salt: 'generated_salt',    // Salt value for password hashing
    creation_date:  Date.now(),    // Auto-generated or you can manually set the timestamp
  })
*/

}