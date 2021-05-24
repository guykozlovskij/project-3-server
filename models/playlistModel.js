import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song', required: true }],
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
  type: { type: String, require: true }
})


export default mongoose.model('Playlist', playlistSchema)