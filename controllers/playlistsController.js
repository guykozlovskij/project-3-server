import Playlist from '../models/playlistModel.js'

//! Get all playlist
async function playlistIndex(req, res, next) {
  try {
    const playlist = await Playlist.find().populate('users')
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}
//! get a particular playlist
async function playlist(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId).populate('users').populate('songs')
    if (!playlist) {
      return res.status(404).json({ error: { message: 'Unauthorized' } })
    }
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}
//! add a playlist
async function add(req, res, next) {
  try {
    req.body.user = req.currentUser
    const playlist = await Playlist.create(req.body)
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}
//! edit an playlist

//! add a song to a playlist 

//! delte a playlist 

//! delete a song from playlist

//! delete user from playlist

//! add a comment to playlist

//! edit a comment to playlist

//! delete a comment to playlist

export default {
  playlistIndex,
  playlist,
  add
}