//! Get all albums
import Album from '../models/albumModel.js'
import Artist from '../models/artistModel.js'
import Song from '../models/songModel.js'


//! Get all albums
async function albumIndex(req, res, next) {
  try {
    const album = await Album.find().populate('leadArtist')
    res.status(200).json(album)

  } catch (err) {
    next(err)
  }
}


//! Find a particualar album
async function album(req, res, next) {
  try {
    const { albumId } = req.params
    const album = await Album.findById(albumId)
      .populate('songs')
      .populate('artists')
    album.songs = await Song.find({ album: albumId })
      .populate('singer')
      .populate('album')

    if (!album) {
      res.status(404).json({ error: { message: 'Album not found' } })
    }
    res.status(200).json(album)

  } catch (err) {
    next(err)
  }
}


//! Get all comments for a particular album 
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


//! Create an album
async function add(req, res, next) {
  try {
    req.body.user = req.currentUser
    const album = await Album.create(req.body)
    res.status(200).json(album)

  } catch (err) {
    next(err)
  }
}


//! Edit an album
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


//! Delete an album
async function remove(req, res, next) {
  try {
    const { albumId } = req.params
    await Album.deleteOne({ '_id': albumId })
    res.sendStatus(202)

  } catch (err) {
    next(err)
  }
}


//! Get all songs for an album
async function songs(req, res, next) {
  try {
    const { albumId } = req.params
    const album = await Album.findById(albumId)
      .populate('singer')
      .populate('songs')
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    res.status(200).json(album.songs)

  } catch (err) {
    next(err)
  }
}


//! Add a song to an album
async function addSong(req, res, next) {
  try {
    const { albumId, songId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    const song = await Song.findById(songId)
    album.songs.push(song)
    await album.save()
    res.status(200).json(song)

  } catch (err) {
    next(err)
  }
}


//! Remove a song from an album
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

//! Add artist to an album
async function addArtist(req, res, next) {
  try {
    const { albumId, artistId } = req.params
    const album = await Album.findById(albumId)
    if (!album) {
      res.send(404).json({ error: { message: 'Album not found' } })
    }
    const artist = await Artist.findById(artistId)
    album.artists.push(artist)
    const albumWithNewArtist = await album.save()
    res.status(200).json(albumWithNewArtist)
    
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
  addArtist,
}