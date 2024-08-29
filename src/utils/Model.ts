export default (name: string) => {

	return { name, model: require(`../models/${name}.ts`).default }
}