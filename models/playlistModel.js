import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
  type: { type: String, default: 'Private' }
})


export default mongoose.model('Playlist', playlistSchema)