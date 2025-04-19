import mongoose from "mongoose"
import { MONGO_URL } from "./config.js"
import chalk from 'chalk'
const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGO_URL)
        console.log(`mongoDB connected successfully ${chalk.green.bold(MONGO_URL)}`)
    } catch (error) {
        console.log(chalk.red.bold("Error Connecting To Databes") + error.message)
        process.exit(1)
    }
}

export default connectDB