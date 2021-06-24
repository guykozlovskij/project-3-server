import mongoose from 'mongoose'
// import { dbURL } from '../config/environment.js'

const dbURL = process.env.DB_URL || process.env.DB_URI
//! Connecting to the database
export default function connectToDb() {

  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
  return mongoose.connect(dbURL, options)
}
