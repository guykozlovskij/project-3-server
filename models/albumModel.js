import mongoose from 'mongoose'

import commentSchema from './commentSchema.js'

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leadArtist: { type: mongoose.Schema.ObjectId, ref: 'Artist' },
  artists: [{ type: mongoose.Schema.ObjectId, ref: 'Artist' }],
  cover: { type: String, default: 'https://www.pngkit.com/png/full/20-202815_vinyl-record-png-transparent-vinyl-png.png' },
  year: { type: Date },
  length: { type: Number, required: true },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
  likesCount: { type: Number, default: 0 },
})

export default mongoose.model('Album', albumSchema)

