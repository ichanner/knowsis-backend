import { Sequelize } from "sequelize"
import config from "../config/"

export default async() => {

	const sequelize: Sequelize = new Sequelize(config.DB_CONN_URL);

	try{

		await sequelize.authenticate();

	}
	catch(err){

		throw err;
	}

	return sequelize;
}