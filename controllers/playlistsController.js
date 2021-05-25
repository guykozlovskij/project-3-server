import Playlist from '../models/playlistModel.js'

//! Get all playlist
async function playlistIndex(req, res, next) {
  try {
    const playlist = await Playlist.find()
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
//! add an playlist

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
  playlist
}