import mongoose from 'mongoose'

import commentSchema from './commentSchema.js'

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  about: { type: String },
  image: { type: String, default: 'default link' },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
  albums: [{ type: mongoose.Schema.ObjectId, ref: 'Album' }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  comments: [commentSchema],
})

export default mongoose.model('Artist', artistSchema)