import sequelize from "sequelize"

export default (vectors: string[], keyword?: string | null) => {

	const keyword_query = keyword ? sequelize.where(

		sequelize.literal(vectors.join('||')), '@@', sequelize.fn('to_tsquery', keyword)) 

	: {};

	const keyword_ranking = keyword ? [
			
		[ sequelize.fn("ts_rank", sequelize.literal(vectors.join('||')), sequelize.fn("to_tsquery", keyword), 1), 'rank' ]

	] : []

	const sort_query:any =  keyword ? [ [sequelize.literal('rank'), "DESC"] ] : [];

	return { keyword_query, keyword_ranking, sort_query }

}