import express from 'express'
import userController from '../controllers/usersController.js'
import songController from '../controllers/songsController.js'

// import secureRoute from '../middleware/secureRoute.js'


const router = express.Router()
// ? USER
router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)


router.route('/playlist/:id/')


//! Songs routes
router.route('/songs/')
  .get(songController.songsIndex)
  .post(songController.uploadSong)

router.route('/songs/:id')
  .get(songController.showSingleSong)
  .delete(songController.removeSong)
  .put(songController.editSong)



//! Comment Routes
router.route('/songs/:id/comments')
  .get(songController.getCommentsForSong)
  .post(songController.createComment)

router.route('/songs/:id/comments/:commentId')
  .put(songController.editComment)
  .delete(songController.deleteComment)



export default router

