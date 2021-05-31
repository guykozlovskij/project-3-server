//! Get all albums
import { NotAuthorized, NotFound } from '../lib/errors.js'
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
    if (!album) {
      throw new NotFound(`Album with id: ${albumId} does not exist.`)
    }
    album.songs = await Song.find({ album: albumId })
      .populate('singer')
      .populate('album')
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
      throw new NotFound(`Album with id: ${albumId} does not exist.`)
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
      throw new NotFound(`Album with id: ${albumId} does not exist.`)
    }
    if (!req.currentUser.equals(album.user._id)) {
      throw new NotAuthorized(`Album with id: ${albumId} does not belong to ${req.currentUser.username}`)
    }
    await Album.updateOne({ '_id': albumId }, req.body)
    if (album.nModified < 1) {
      return res.sendStatus(304)
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
      throw new NotFound(`Album with id: ${albumId} does not exist.`)
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
      throw new NotFound(`Album with id: ${albumId} does not exist.`)
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
      throw new NotFound(`Album with id: ${albumId} not found.`)
    }
    if (!req.currentUser.equals(album.user)) {
      throw new NotAuthorized(`Album with id: ${albumId} does not belong to ${req.currentUser.username}`)
    }
    const song = album.songs.findIndex(song => song.equals(songId))
    if (song === -1) {
      throw new NotFound(`Song with id: ${songId} does not exist.`)
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
      throw new NotFound(`Album with id: ${albumId} not found.`)
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