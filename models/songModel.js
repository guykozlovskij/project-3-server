import mongoose from 'mongoose'

import commentSchema from './commentSchema.js'

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String },
  singer: { type: mongoose.Schema.ObjectId, ref: 'Artist', required: true },
  cover: { type: String, default: 'https://image.flaticon.com/icons/png/512/26/26433.png' }, // ! I suggest we remove default link, front end can provide default image if no image added
  year: { type: Date, required: true },
  source: { type: String },
  musicSrc: { type: String },
  length: {type: Number},
  album: { type: mongoose.Schema.ObjectId, ref: 'Album' },
  artists: [{ type: mongoose.Schema.ObjectId, ref: 'Artist' }],
  comments: [commentSchema],
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
})

export default mongoose.model('Song', songSchema)