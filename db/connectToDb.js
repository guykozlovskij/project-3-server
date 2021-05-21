import mongoose from 'mongoose'
import { dbURL } from '../config/environment.js'

// ? Do the connecting!
export default function connectToDb() {
  // ? Giving mongoose some options that we don't really care about.
  // ? They remove the warnings.
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
  // ? This is the really important line:
  // ! mongoose.connect returns A PROMISE.
  return mongoose.connect(dbURL, options)
}
