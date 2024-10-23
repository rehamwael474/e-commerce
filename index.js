import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { scheduleJob } from 'node-schedule'
import { connectDB } from './db/connection.js'
import { initApp } from './src/modules/initApp.js'
import { User } from './db/index.js'
import { status } from './src/utils/constant/enums.js'



const app = express()
const port = process.env.PORT || 3000;
dotenv.config({path: path.resolve('./config/.env')})

// connect db
connectDB()
initApp(app,express)

const job = scheduleJob('1 1 1 * * *', async function(){
  const deletedUsers = await User.find({
      status: status.DELETED,
      updatedAt: {$lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000}
  }) 
  const userIds = deletedUsers.map((user) => user._id)
  await User.deleteMany({ _id: { $in: userIds }})
});
// listen
app.listen(port,() => console.log(`app listening on port ${port}!`))