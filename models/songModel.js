import mongoose from 'mongoose'

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leadArtist: { type: mongoose.Schema.ObjectId, ref:'Artist', required: true },
  image: { type: String, default: 'default link' }, // ! I suggest we remove default link, front end can provide default image if no image added
  year: { type: Date, required: true },
  audioSrc: { type: String },
  albums: { type: mongoose.Schema.ObjectId, ref: 'Album' },
  artists: [{ type: mongoose.Schema.ObjectId, ref: 'Artist' }],
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
})

export default mongoose.model('Song', songSchema)