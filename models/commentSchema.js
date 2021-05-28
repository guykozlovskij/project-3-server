import mongoose from 'mongoose'

export default new mongoose.Schema({
  username: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
})
