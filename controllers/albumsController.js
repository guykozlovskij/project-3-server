//! Get all albums
import Album from '../models/albumModel.js'
import Artist from '../models/artistModel.js'
import Song from '../models/songModel.js'
import User from '../models/userModel.js'

//! get a particular album
async function albumIndex(req, res, next) {
  try {
    const album = await Album.find()
    res.status(200).json(album)
  } catch (err) {
    next(err)
  }
}

//! Find a particualar album
async function album(req, res, next) {
  try {
    const { albumId } = req.params
    const album = await Album.findById(albumId).populate('songs').populate('artists')
    if (!album) {
      res.status(404).json({ error: { message: 'Album not found' } })
    }
    res.status(200).json(album)
  } catch (err) {
    next(err)
  }
}

//! Get all comments for this particular album 
async function comments(req, res, next) {
  try {
    const { albumId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    res.status(200).json(album.comments)
  } catch (err) {
    next(err)
  }
}

//! add an album
async function add(req, res, next) {
  try {
    req.body.user = req.currentUser
    const album = await Album.create(req.body)
    res.status(200).json(album)
  } catch (err) {
    next(err)
  }
}

//! edit an album
async function edit(req, res, next) {
  try {
    const { albumId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    if (!req.currentUser.equals(album.user._id)) {
      return res.status(302).json({ error: { message: 'Unauthorized' } })
    }
    await Album.updateOne({ '_id': albumId }, req.body)
    if (album.nModified < 1) {
      res.sendStatus(304)
    }
    res.status(200).json(await Album.findById(albumId))


  } catch (err) {
    next(err)
  }
}

//! delete an album
async function remove(req, res, next) {
  try {
    const { albumId } = req.params
    await Album.deleteOne({ '_id': albumId })
    res.sendStatus(202)
  } catch (err) {
    next(err)
  }
}

//! get all songs
async function songs(req, res, next) {
  try {
    const { albumId } = req.params
    const album = await Album.findById(albumId).populate('songs')
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    res.status(200).json(album.songs)
  } catch (err) {
    next(err)
  }
}

//! add a song to album
async function addSong(req, res, next) {
  try {
    const { albumId, songId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    const song = await Song.findById(songId)
    album.songs.push(song)
    const albumWithNewSong = await album.save()
    res.status(200).json(albumWithNewSong.songs)
  } catch (err) {
    next(err)
  }
}

//! remove a song from album
async function removeSong(req, res, next) {
  try {
    const { albumId, songId } = req.params
    const album = await Album.findById(albumId).populate('songs')
    if (!album) {
      return res.status(404).json({ error: { message: 'Album not found' } })
    }
    if (!req.currentUser.equals(album.user)) {
      return res.status(401).json({ error: { message: 'Unauthorized' } })
    }
    const song = album.songs.findIndex(song => song.equals(songId))
    if (song === -1) {
      return res.status(404).json('Not found')
    }
    album.songs.splice(song, 1)
    const albumWithDeletedSong = await album.save()
    res.status(200).json(albumWithDeletedSong.songs)
  } catch (err) {
    next(err)
  }
}

//! add a comment to songs
async function addComment(req, res, next) {
  try {
    const { albumId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    const user = await User.find()
    req.body.username = user[0]
    album.comments.push(req.body)
    const albumWithNewComment = await album.save()
    res.status(200).json(albumWithNewComment.comments)
  } catch (err) {
    next(err)
  }
}

//! edit a comment to songs
async function editComment(req, res, next) {
  try {
    const { albumId, commentId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    const comment = await album.comments.id(commentId)
    if (!req.currentUser.equals(comment.username)) {
      return res.status(401).json({ error: { message: 'Unauthorized' } })
    }
    comment.set(req.body)
    const albumWithDeletedCommented = await album.save()
    res.status(200).json(albumWithDeletedCommented.comments)
  } catch (err) {
    next(err)
  }
}

//! delete a comment to songs
async function removeComment(req, res, next) {
  try {
    const { albumId, commentId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      res.status(404).json({ error: { message: 'Album not found' } })
    }
    const comment = album.comments.id(commentId)
    if (!req.currentUser.equals(comment.username)) {
      return res.status(401).json({ error: { message: 'Unauthorized' } })
    }
    await comment.remove()
    const albumWithCommentRemoved = await album.save()
    res.status(200).json(albumWithCommentRemoved.comments)
  } catch (err) {
    next(err)
  }
}


export default {
  albumIndex,
  album,
  comments,
  add,
  edit,
  remove,
  songs,
  addSong,
  removeSong,
  addComment,
  editComment,
  removeComment,
}