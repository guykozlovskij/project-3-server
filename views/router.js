import express from 'express'
import albumsController from '../controllers/albumsController.js'
import userController from '../controllers/usersController.js'
import songController from '../controllers/songsController.js'

import secureRoute from '../middleware/secureRoute.js'


const router = express.Router()
// ? USER
router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)

//? Albums
router.route('/albums')
  .get(albumsController.albumIndex)
  .post(secureRoute,albumsController.add)

router.route('/albums/:albumId')
  .get(albumsController.album)
  .put(secureRoute,albumsController.edit)
  .delete(secureRoute,albumsController.remove)

router.route('/albums/:albumId/songs')
  .get(albumsController.songs)
  .post(secureRoute,albumsController.addSong)

router.route('/albums/:albumId/songs/:songId')
  .delete(secureRoute,albumsController.removeSong)

router.route('/albums/:albumId/comments')
  .get(albumsController.comments)
  .post(secureRoute,albumsController.addComment)

router.route('/albums/:albumId/comments/:commentId')
  .put(secureRoute,albumsController.editComment)
  .delete(secureRoute,albumsController.removeComment)

//? Songs
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





export default router

