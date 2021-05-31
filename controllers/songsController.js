import Song from '../models/songModel.js'
import { NotFound } from '../lib/errors.js'
import Artist from '../models/artistModel.js'


//! Get all songs
async function songsIndex(req, res, next) {
  try {
    const songList = await Song.find()
      .populate('singer')
      .populate('albums')

    res.status(200).json(songList)
    
  } catch (e) {
    next(e)
  }
}

//! Get a particular song
async function showSingleSong(req, res, next) {
  try {
    const id = req.params.id
    const song = await Song.findById(id)
      .populate('comments')
      .populate('artists')
      .populate('albums')

    if (!song) {
      throw new NotFound('No song found!')
    }
    res.status(200).json(song)

  } catch (e) {
    next(e)
  }
}

//! Get all comments for a particular song
async function getCommentsForSong(req, res, next) {
  try {
    const id = req.params.id
    const commentsOfSong = await Song.findById(id)
      .populate('comments')
      .populate('comments.username')

    if (!commentsOfSong) {
      throw new NotFound('No comment found!')
    }
    res.status(200).json(commentsOfSong.comments)

  } catch (e) {
    next(e)
  }
}

//! Create/upload a song
async function uploadSong(req, res, next) {
  const artist = await Artist.find()
  req.body.leadArtist = artist[0]
  req.body.user = req.currentUser

  try {
    const newSong = await Song.create(req.body)
    res.status(201).json(newSong)

  } catch (e) {
    next(e)
  }
}

//! Delete a song
async function removeSong(req, res, next) {
  try {
    const currentUserId = req.currentUser._id
    const song = await Song.findById(req.params.id)
    if (!currentUserId.equals(song.user)) {
      throw new NotFound('This song does not belong to you')
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


//! Edit a song
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
    req.body.username = req.currentUser
    const song = await Song.findById(req.params.id)
      .populate('user')
      .populate('comments.user')

    song.comments.push(req.body)
    const savedSong = await song.save()
    res.send(savedSong)

  } catch (e) {
    next(e)
  }
}

//! Edit a song comment
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

//! Delete a song comment
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
