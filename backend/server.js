import express from 'express'
import cors from 'cors'
import { PORT } from './configs/config.js'
import connectDB from './configs/db.js'
import chalk from 'chalk'
import Route from './routers/userRoute.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', Route)




app.listen(PORT, ()=>{
    connectDB()
    console.log(`🚀 ${chalk.green.bold("Server is running on PORT:")} ${PORT}`)
})