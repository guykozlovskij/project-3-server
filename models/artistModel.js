import mongoose from 'mongoose'

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  about: { type: String },
  image: { type: String, default: 'default link' },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
  albums: [{ type: mongoose.Schema.ObjectId, ref: 'Album' }],
<<<<<<< HEAD
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
=======
  //! TODO: change key to 'user'
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
>>>>>>> seeding-models
})

export default mongoose.model('Artist', artistSchema)