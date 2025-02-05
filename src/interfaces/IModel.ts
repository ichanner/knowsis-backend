import { Sequelize, Model as SequelizeModel, ModelCtor } from 'sequelize';

export default interface IModel {
  name: string;
  initialize: (sequelize: Sequelize) => ModelCtor<SequelizeModel>;
}