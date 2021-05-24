import Song from '../models/songModel.js'
import { NotFound } from '../lib/errors.js'
import { NotValid } from '../lib/errors.js'

import Artist from '../models/artistModel.js'
import Ablum from '../models/albumModel.js'


//! GET all songs
async function songsIndex(req, res, next) {
  try {
    const songList = await Song.find()
      .populate('leadArtist')
    res.status(200).json(songList)
  } catch (e) {
    next(e)
  }
}


//! GET a particular song
async function showSingleSong(req, res, next) {
  try {
    const id = req.params.id
    const song = await Song.findById(id)
      .populate('comments')
      .populate('artists')
      .populate('albums')

    if (!song) {
      throw new NotFound('No song found!')
    } res.status(200).json(song)
  } catch (e) {
    next(e)
  }
}


//! GET all comments for a particular song
async function getCommentsForSong(req, res, next) {
  try {
    const id = req.params.id
    const commentsOfSong = await Song.findById(id).populate('comments')

    if (!commentsOfSong) {
      throw new NotFound('No comment found!')
    } res.status(200).json(commentsOfSong.comments)
  } catch (e) {
    next(e)
  }
}


//! POST a song
async function uploadSong(req, res, next) {
  const artist = await Artist.find()
  req.body.leadArtist = artist[0]

  //!-------
  //TODO - update lead artist
  //!-------

  try {
    const newSong = await Song.create(req.body)
    res.status(201).json(newSong)

  } catch (e) {
    next(e)
  }
}


//! DELETE song
async function removeSong(req, res, next) {
  try {
    const song = await Song.findById(req.params.id)

    if (!song) {
      throw new NotFound('No song found.')
    }

    await song.deleteOne()
    res.sendStatus(204)

  } catch (e) {
    next(e)
  }
}


//! Edit (PUT) Song
async function editSong(req, res, next) {
  try {
    const song = await Song.findById(req.params.id)

    if (!song) {
      throw new NotFound('No song found.')
    }

    song.set(req.body)
    song.save()
    res.status(202).json(song)

  } catch (e) {
    next(e)
  }
}


// ! add a comment to songs
// async function createComment(req, res, next) {
//   try {
//     //* Get Song to comment on
//     const song = await Song.find
//       .populate('user')
//       .populate('comments.user')

//     //* Push comment to song


//     //* Save and update song
//   } catch (e) {
//     next(e)
//   }
// }

//! edit a comment to songs

//! delete a comment to songs


export default {
  songsIndex,
  showSingleSong,
  getCommentsForSong,
  uploadSong,
  removeSong,
  editSong,
  // createComment,

}