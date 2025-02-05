import { Router } from 'express'
import registerLibraries from "./routes/libraries/"
import registerAuth from "./routes/auth"
import registerInvites from "./routes/invites"
import registerAI from "./routes/ai"
export default () => {

	const app = Router()

	registerLibraries(app);
	registerAuth(app);
	registerInvites(app)
	ai(app);

	return app;
}