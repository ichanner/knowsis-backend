//@ts-nocheck
import { createServer } from "http"
import express from "express"
import config from "./config/index"
import initLoaders from './loaders/index'

const app = express()
const server = createServer(app)


initLoaders(app, server).then(()=>{

	server.listen(config.PORT, ()=>{

		console.log(`Server initialized on port ${config.PORT}`)
	})
})

