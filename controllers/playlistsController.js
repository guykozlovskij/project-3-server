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
    req.body.users = req.currentUser
    const playlist = await Playlist.create(req.body)
    res.status(200).json(playlist)
  } catch (err) {
    next(err)
  }
}
//! edit an playlist
async function edit(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    if (playlist.type.toLowerCase() === 'private' && !playlist.users.includes(req.currentUser._id)) {
      return res.status(302).json({ error: { message: 'Unauthorized' } })
    }
    const editedPlaylist = await Playlist.updateOne({ '_id': playlistId }, req.body)
    if (editedPlaylist.nModified < 1) {
      res.sendStatus(304)
    }
    res.status(200).json(await Playlist.findById(playlistId))


  } catch (err) {
    next(err)
  }
}
//! add a song to a playlist 
async function addSong(req, res, next) {
  try {
    const { playlistId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    playlist.songs.push(req.body)
    const albumWithNewSong = await album.save()
    res.status(200).json(albumWithNewSong.songs)
  } catch (err) {
    next(err)
  }
}

//! delte a playlist 

//! delete a song from playlist

//! delete user from playlist



export default {
  playlistIndex,
  playlist,
  add,
  edit
}