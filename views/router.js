import express from 'express'

import secureRoute from '../middleware/secureRoute.js'

import albumsController from '../controllers/albumsController.js'
import userController from '../controllers/usersController.js'
import songController from '../controllers/songsController.js'
import artistsController from '../controllers/artistsController.js'
import playlistsController from '../controllers/playlistsController.js'


const router = express.Router()
// ? USER
router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)

//? Albums
//! Album routes
router.route('/albums')
  .get(albumsController.albumIndex)
  .post(secureRoute, albumsController.add)

router.route('/albums/:albumId')
  .get(albumsController.album)
  .put(secureRoute, albumsController.edit)
  .delete(secureRoute, albumsController.remove)

//! Song routes in albums
router.route('/albums/:albumId/songs')
  .get(albumsController.songs)

router.route('/albums/:albumId/songs/:songId')
  .post(secureRoute, albumsController.addSong)
  .delete(secureRoute, albumsController.removeSong)

//! add artist to album
router.route('/albums/:albumId/artists/:artistId')
  .post(secureRoute, albumsController.addArtist)

//! Comment routes in albums
router.route('/albums/:albumId/comments')
  .get(albumsController.comments)
  .post(secureRoute, albumsController.addComment)

router.route('/albums/:albumId/comments/:commentId')
  .put(secureRoute, albumsController.editComment)
  .delete(secureRoute, albumsController.removeComment)

//? Songs
//! Songs routes
router.route('/songs/')
  .get(songController.songsIndex)
  .post(secureRoute, songController.uploadSong)

router.route('/songs/:id')
  .get(songController.showSingleSong)
  .delete(secureRoute, songController.removeSong)
  .put(secureRoute, songController.editSong)



//* Comment Routes
router.route('/songs/:id/comments')
  .get(songController.getCommentsForSong)
  .post(secureRoute, songController.createComment)


router.route('/songs/:id/comments/:commentId')
  .put(secureRoute, songController.editComment)
  .delete(secureRoute, songController.deleteComment)

//? Playlist
router.route('/playlist')
  .get(playlistsController.playlistIndex)
  .post(secureRoute, playlistsController.add)

//! Artist routes
router.route('/artists/')
  .get(artistsController.artistIndex)
  .post(secureRoute, artistsController.createArtist)

router.route('/artists/:artistId')
  .get(artistsController.artist)
  .put(secureRoute, artistsController.editArtist)
  .delete(secureRoute, artistsController.removeArtist)

router.route('/artists/:artistId/songs/:songId')
  .post(secureRoute, artistsController.addSongToArtist)

router.route('/artists/:artistId/albums/:albumId')
  .post(secureRoute, artistsController.addAlbumToArtist)


router.route('/playlist/:playlistId')
  .get(playlistsController.playlist)
  .put(secureRoute, playlistsController.edit)
  .delete(secureRoute, playlistsController.remove)

router.route('/playlist/:playlistId/songs')
  .get(playlistsController.songs)

router.route('/playlist/:playlistId/songs/:songId')
  .post(secureRoute, playlistsController.addSong)
  .delete(secureRoute, playlistsController.removeSong)

export default router

