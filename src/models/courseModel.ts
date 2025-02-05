import { DataTypes, Model, Sequelize, ModelType } from 'sequelize';
import { Container } from 'typedi';
import ICourseworkProgress from '../interfaces/ICourseWorkProgress';

class CourseworkProgressModel extends Model<ICourseworkProgress> {}

export default (sequelize: Sequelize) => {
  const userModel: ModelType = Container.get('userModel');
  const documentModel: ModelType = Container.get('documentModel');

  CourseworkProgressModel.init(
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: userModel, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      document_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: documentModel, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      course_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      module_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      progress: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      last_interaction: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: Date.now(),
      },
    },
    { sequelize, tableName: 'CourseworkProgress' }
  );

  CourseworkProgressModel.sync({ force: false });

  return CourseworkProgressModel;
};