import mongoose from 'mongoose'
import commentSchema from './commentSchema.js'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  about: { type: String },
  playlists: [{ type: mongoose.Schema.ObjectId, ref: 'Playlist' }],
  likes: [{ type: String }],
  comments: [commentSchema],
  addedSongs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
})

export default userSchema