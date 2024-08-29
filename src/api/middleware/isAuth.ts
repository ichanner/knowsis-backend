import { Request, Response, NextFunction } from "express"

export default (req: Request, res: Response, next: NextFunction) => {

	//Do auth

	req.user = {id: '123'}

	next()
}