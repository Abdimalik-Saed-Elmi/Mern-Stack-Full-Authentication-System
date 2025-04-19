import express from 'express'
import cors from 'cors'
import { PORT } from './configs/config.js'
import connectDB from './configs/db.js'
import chalk from 'chalk'
import Route from './routers/userRoute.js'
import ProfileRouter from './routers/profileRoute.js'
import path from 'path'

const app = express()

const __dirname = path.resolve()

app.use(cors())

app.use(express.json())


app.use('/api/auth', Route)
app.use('/api/auth', ProfileRouter)


if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get("", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend','dist', 'index.html'));
    });
}




app.listen(PORT, ()=>{
    connectDB()
    console.log(`🚀 ${chalk.green.bold("Server is running on PORT:")} ${PORT}`)
})