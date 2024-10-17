import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/connection.js'
import { initApp } from './src/modules/initApp.js'

dotenv.config({path: path.resolve('./config/.env')})
const app = express()
const port = process.env.PORT || 3000;


// connect db
connectDB()
initApp(app,express)
app.listen(port,() => console.log(`app listening on port ${port}!`))