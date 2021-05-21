import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  dependencyId: { type: String, required: true }
})
export default mongoose.model('Comment', commentSchema)