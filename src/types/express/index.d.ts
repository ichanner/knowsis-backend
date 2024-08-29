import "express"

declare module 'express'{

	export interface Request{

		user?: { id: string },
		cover_url?: string,
		document_url?: string,

		// Define the ParsedData type for req.query and req.body
	    query: { [key: string]: any };
	    body: { [key: string]: any };

	}
}