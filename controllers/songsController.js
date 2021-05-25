import Song from '../models/songModel.js'
import { NotFound } from '../lib/errors.js'

import Artist from '../models/artistModel.js'
import User from '../models/userModel.js'


//! GET all songs
async function songsIndex(req, res, next) {
  try {
    const songList = await Song.find()
      .populate('leadArtist')
      .populate('album')
      .populate('artists')
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
  req.body.user = req.currentUser
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
    const currentUserId = req.currentUser._id
    const song = await Song.findById(req.params.id)

    if (!currentUserId.equals(song.user)) {

      throw new NotFound('This hymn does not belong to you')
    }

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
    const currentUserId = req.currentUser._id
    const song = await Song.findById(req.params.id)

    if (!song) {
      throw new NotFound('No song found.')
    }

    if (!currentUserId.equals(song.user)) {

      throw new NotFound('This song does not belong to you')
    }

    song.set(req.body)
    song.save()
    res.status(202).json(song)

  } catch (e) {
    next(e)
  }
}


//! add a comment to songs
async function createComment(req, res, next) {
  req.body.user = req.currentUser

  try {
    const user = await User.find()
    req.body.username = user[0]

    //* Get Song to comment on
    const song = await Song.findById(req.params.id)
      .populate('user')
      .populate('comments.user')

    //* Push comment to song
    song.comments.push(req.body)

    //* Save and update song
    const savedSong = await song.save()
    res.send(savedSong)

  } catch (e) {
    next(e)
  }
}


//! edit a comment to songs
async function editComment(req, res, next) {
  try {
    const { commentId } = req.params
    const song = await Song.findById(req.params.id)

    if (!song) {
      throw new NotFound('No song found.')
    }
    const comment = song.comments.id(commentId)

    if (!req.currentUser._id.equals(comment.username)) {
      return res.status(401).send({ message: 'Unauthorized' })
    }

    comment.set(req.body)
    const savedSong = await song.save()
    res.send(savedSong)

  } catch (e) {
    next(e)
  }
}


//! delete a comment to songs
async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params
    const song = await Song.findById(req.params.id)
    const comment = song.comments.id(commentId)

    if (!song) {
      throw new NotFound('No song found.')
    }
    if (!comment) {
      throw new NotFound('No coment found.')
    }

    if (!req.currentUser._id.equals(comment.username)) {
      return res.status(401).send({ message: 'Unauthorized' })
    }

    await comment.remove()
    comment.set(req.body)
    const savedSong = await song.save()
    res.send(savedSong)

  } catch (e) {
    next(e)
  }
}



export default {
  songsIndex,
  showSingleSong,
  getCommentsForSong,
  uploadSong,
  removeSong,
  editSong,
  createComment,
  editComment,
  deleteComment,
}