//@ts-nocheck
import express from "express"
import http from "http"
import initExpress from "./express"

export default async(app : express.Application, server : http.Server)=>{

	await initExpress(app)
}