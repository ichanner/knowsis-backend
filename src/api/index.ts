import { Router } from 'express'
import registerLibraries from "./routes/libraries"

export default () => {

	const app = Router()

	registerLibraries(app);

	return app;
}