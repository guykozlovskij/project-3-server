import User from '../models/userModel.js'
// import { NotValid } from '../lib/errors.js'
// import jwt from 'jsonwebtoken'
// import { secret } from '../config/environment.js'

async function register(req, res, next) {
  try {
    const newUser = await User.create(req.body)
    res.status(201).json(newUser)
  } catch (e) {
    next(e)
  }
}

// async function login(req, res, next) {
//   try {
//     const user = await User.findOne({ email: req.body.email })
//     if (!user) {
//       throw new NotValid(
//         'Username and/or password not found. Please try again.'
//       )
//     }
//     const isValidPw = user.validatePassword(req.body.password)
//     if (!isValidPw) {
//       throw new NotValid(
//         'Username and/or password not found. Please try again.'
//       )
//     }

//     // Create jwt and send to user
//     const token = jwt.sign(
//       { userId: user._id }, //also often know as sub
//       secret,
//       { expiresIn: '12h' }

//     )

//    res.status(202).json({ message: 'Login Success!', token })
//  } catch (e) {
//    next(e)
//  }
//}

export default {
  register,
  // login,
}
