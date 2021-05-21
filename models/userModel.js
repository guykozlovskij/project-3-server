import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import mongooseHidden from 'mongoose-hidden'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, },
  image: { type: String, default: 'urlwithdefaultavatar' },
  about: { type: String },
  playlists: [{ type: mongoose.Schema.ObjectId, ref: 'Playlist' }],
  likes: [{ type: String }],
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  addedSongs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
})


userSchema.plugin(uniqueValidator)
userSchema.plugin(mongooseHidden({ defaultHidden: { _id: true, password: true, email: true } }))


export default mongoose.model('User', userSchema)