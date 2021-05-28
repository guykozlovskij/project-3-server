import Album from '../models/albumModel.js'
import Artist from '../models/artistModel.js'
import Song from '../models/songModel.js'
import User from '../models/userModel.js'
import Playlist from '../models/playlistModel.js'
import { NotFound } from '../lib/errors.js'

async function like(req, res, next) {
  try {
    let thingToLike
    req.body.user = req.currentUser
    const model = req.params.type
    const id = req.params.id
    const method = req.params.plusOrMinus

    thingToLike = model === 'Artist' ? await Artist.findById(id) : null
    thingToLike = model === 'Album' ? await Album.findById(id) : null
    thingToLike = model === 'Playlist' ? await Playlist.findById(id) : null
    thingToLike = model === 'Song' ? await Song.findById(id) : null
    if (!thingToLike) {
      throw new NotFound('Nothing Found')
    }
    console.log(thingToLike)
    if (method === 'plus') {
      thingToLike.likesCount++
      thingToLike = await thingToLike.save()
      console.log(thingToLike)
      const user = await User.findById(req.currentUser._id)
      user.likes.push(id)
      const savedUser = await user.save()
      console.log(user)

      res.status(200).json(savedUser)
    } else if (method === 'minus') {
      if (thingToLike.likesCount > 0) {
        thingToLike.likesCount--
        await thingToLike.save()
        console.log(thingToLike)
        const user = await User.findById(req.currentUser._id)
        const thingToRemove = user.likes.findIndex(savedId => savedId === id)
        console.log('THING TO REMOVE', thingToRemove)
        user.likes.splice(thingToRemove, 1)
        console.log('USER LIKES', user.likes)
        // user.likes[thingToRemove].remove()
        const savedUser = await user.save()
        res.status(200).json(savedUser)
      }
    }
  } catch (e) {
    console.log('BEEN AN ERROR', e)
    next(e)
  }
}

export default {
  like,
}
