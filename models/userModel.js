import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import mongooseHidden from 'mongoose-hidden'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: 'urlwithdefaultavatar' },
  about: { type: String },
  playlists: [{ type: mongoose.Schema.ObjectId, ref: 'Playlist' }],
  likes: [{ type: String }],
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  addedSongs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
})

//  * Hash the password
userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next()
})
// * Compare hashed password given with that stored in the DB
userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

// ? Virtual password
// ? _ used for temporary reasons or internal reasons
userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })
userSchema.pre('validate', function checkPassword(next) {
  if (
    this.isModified('password') &&
    this.password !== this._passwordConfirmation
  ) {
    this.invalidate('passwordCConfirmation', 'should match password')
  }
  next()
})

userSchema.plugin(uniqueValidator)
userSchema.plugin(mongooseHidden({ defaultHidden: { password: true, email: true } }))


export default mongoose.model('User', userSchema)