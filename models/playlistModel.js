import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cover: { type: String, default: 'https://www.pngkit.com/png/full/20-202815_vinyl-record-png-transparent-vinyl-png.png' },
  text: { type: String },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
  type: { type: String, default: 'Private' },
  likesCount: { type: Number, default: 0 },
})


export default mongoose.model('Playlist', playlistSchema)