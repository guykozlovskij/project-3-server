import Artist from '../models/artistModel.js'
import User from '../models/userModel.js'
import Song from '../models/songModel.js'
import Album from '../models/albumModel.js'
import { NotFound } from '../lib/errors.js'


//* Getting all artists
async function artistIndex(req, res, next) {
  try {
    const artist = await Artist.find()
    res.status(200).json(artist)

  } catch (e) {
    next(e)
  }
}


//* Getting a particular artist 
async function artist(req, res, next) {
  try {
    const { artistId } = req.params
    const artist = await Artist.findById(artistId)
      .populate('user')
      .populate('songs')
      .populate('albums')
    if (!artist) {
      throw new NotFound(`Artist with id: ${artistId} does not exist.`)
    }
    res.status(200).json(artist)

  } catch (e) {
    next(e)
  }
}


//* Creating an artist
async function createArtist(req, res, next) {
  try {
    const user = await User.find()
    req.body.user = user[0]
    const artist = await Artist.create(req.body)
    res.status(200).json(artist)

  } catch (e) {
    next(e)
  }
}


//* Editing an artist
async function editArtist(req, res, next) {
  try {
    const user = await User.find()
    req.body.user = user[0]

    const { artistId } = req.params
    const artist = await Artist.updateOne({ '_id': artistId }, req.body)

    if (artist.n < 1) {
      throw new NotFound(`Artist with id: ${artistId} does not exist.`)
    }
    if (artist.nModified < 1) {
      res.sendStatus(304)
    }
    res.status(200).json(await Artist.findById(artistId))

  } catch (e) {
    next(e)
  }
}


//* Assigning song to artist
async function addSongToArtist(req, res, next) {
  try {
    const user = await User.find()
    //* Initial songs seeded are assigned to user1
    req.body.user = user[0]
    const { artistId, songId } = req.params
    const artist = await Artist.findById(artistId)
    const song = await Song.findById(songId)

    if (!artist) {
      throw new NotFound(`Artist with id: ${artistId} does not exist.`)
    }
    artist.songs.push(song)
    const artistWithNewSong = await artist.save()
    res.status(200).json(artistWithNewSong.songs)

  } catch (e) {
    next(e)
  }
}


//* Assigning albums to artist 
async function addAlbumToArtist(req, res, next) {
  try {
    const user = await User.find()
    req.body.user = user[0]

    const { albumId, artistId } = req.params

    const artist = await Artist.findById(artistId)
    const album = await Album.findById(albumId)

    if (!artist) {
      throw new NotFound(`Artist with id: ${artistId} does not exist.`)
    }
    if (!album) {
      throw new NotFound(`Album with id: ${albumId} does not exist.`)
    }
    artist.albums.push(album)
    const artistWithNewAlbum = await artist.save()
    res.status(200).json(artistWithNewAlbum.albums)

  } catch (e) {
    next(e)
  }
}


//* Deleting an artist
async function removeArtist(req, res, next) {
  try {
    const { artistId } = req.params
    await Artist.deleteOne({ '_id': artistId })
    res.sendStatus(202)
  } catch (e) {
    next(e)
  }
}


export default {
  artistIndex,
  artist,
  createArtist,
  editArtist,
  addSongToArtist,
  addAlbumToArtist,
  removeArtist,
}