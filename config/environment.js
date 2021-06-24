import dotenv from 'dotenv'
dotenv.config()

export const dbURI =
  process.env.DB_URI || 'mongodb+srv://user:YlBT7YcYzlNnnmjD@cluster0.hqxvi.mongodb.net/planets-db?retryWrites=true&w=majority'
export const port = process.env.PORT || 4000
//JWT Secret Token
export const secret = process.env.SECRET || 'bowlrainbowsheddrivegear'