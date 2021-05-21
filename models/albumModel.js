import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artists: [{ type: mongoose.Schema.ObjectId, ref: 'Artist' }],
  image: { type: String, default: 'default link' },
  year: { type: Date, required: true },
  lenght: { type: Number, required: true },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song', required: true }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
})

albumSchema.plugin(uniqueValidator)

export default mongoose.model('User', albumSchema)

