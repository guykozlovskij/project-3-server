import mongoose from 'mongoose'

import commentSchema from './commentSchema.js'

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artists: [{ type: mongoose.Schema.ObjectId, ref: 'Artist' }],
  image: { type: String, default: 'default link' },
  year: { type: Date, required: true },
  lenght: { type: Number, required: true },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
})

export default mongoose.model('Album', albumSchema)

