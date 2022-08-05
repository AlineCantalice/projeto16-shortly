import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors(), express.json())

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});