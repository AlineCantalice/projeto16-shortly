import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import userRouter from './routers/userRouter.js'

dotenv.config()

const app = express()
app.use(cors(), express.json())

app.use(userRouter)

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});