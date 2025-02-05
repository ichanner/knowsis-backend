import sequelize from "sequelize"

export default (object: object) => {

	const filtered_array= Object.entries(object).reduce((acc: any, [key, value]) => {

		if(value !== undefined && value !== null){

			acc.push([key, value])

			acc.push([`${key}_vector`, sequelize.fn('to_tsvector', 'english', value)])
		}

		return acc;

	},[])


	return Object.fromEntries(filtered_array) //converts array back to object 
}