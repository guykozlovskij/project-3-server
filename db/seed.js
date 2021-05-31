import mongoose from 'mongoose'
import connectToDb from './connectToDb.js'

//! Models
import User from '../models/userModel.js'
import Artist from '../models/artistModel.js'
import Album from '../models/albumModel.js'
import Song from '../models/songModel.js'
import Playlist from '../models/playlistModel.js'

//! Users
import usersData from './data/userData.js'
import artistData from './data/artistData.js'
import albumData from './data/albumData.js'
import songData from './data/songData.js'


async function seedDatabase() {
  try {
    await connectToDb()
    console.log('🤖 Successfully connected to mongo')
    await mongoose.connection.db.dropDatabase()
    console.log('🤖 Removed all data')


    //! Seed users
    const users = await User.create(usersData)
    console.log(`🤖 ${users.length} users created!`)


    //! Seed artists
    const artistDataWithUser = artistData.map((artist) => {
      return { ...artist, user: users[0] }
    })
    const artists = await Artist.create(artistDataWithUser)


    //! Seed albums
    const albumWithArtistAndUser = albumData.map((album) => {
      return {
        ...album,
        user: users[0],
        artists: artists,
        leadArtist: artists[0]._id,
      }
    })
    const albums = await Album.create(albumWithArtistAndUser)

    //* Initial comment to all songs
    const commentToAdd = {
      username: users[0]._id,
      text: 'A great song, indeed.',
    }


    //! Seed songs
    const songsWithUser = songData.map((song) => {
      return {
        ...song,
        user: users[0]._id,
        singer: artists[0],
        album: albums[0],
        comments: commentToAdd,
        isDeleted: false,
      }
    })
    const songs = await Song.create(songsWithUser)
    console.log(`${songs.length} songs have been added`)


    //! Create a playlist and add songs to it
    //* Initial BenSound playlist
    const playlist = await Playlist.create({
      name: 'Bensound Collection',
      text: 'Mix songs from Bensound',
      songs: songs,
      users: users[0],
      user: users[0],
      type: 'public',
    })

    const playlistUser = await User.findById(users[0])
    playlistUser.playlists.push(playlist._id)
    await playlistUser.save()


    //! Adding songs to an album
    const albumToAddSongTo = await Album.findById(albums[0]._id)
    songs.map((song) => {
      albumToAddSongTo.songs.push(song._id)
      albumToAddSongTo.comments.push(commentToAdd)
    })
    await albumToAddSongTo.save()


    //! Adding songs to an artist
    const artistToAddSongsTo = await Artist.findById(artists[0]._id)
    songs.map((song) => {
      artistToAddSongsTo.songs.push(song._id)
      artistToAddSongsTo.comments.push(commentToAdd)
    })
    

    //! Adding albums to an artist
    albums.map((album) => {
      artistToAddSongsTo.albums.push(album)
    })
    await artistToAddSongsTo.save()


    //! Adding a song to user addedSongs
    const userWithSong = await User.findById(users[0]._id)
    songs.map((song) => {
      userWithSong.addedSongs.push(song._id)
    })
    await userWithSong.save()
    console.log('Songs added to users addedSongs')

    await mongoose.connection.close()
    console.log('🤖 Disconnected from mongo. All done!')

  } catch (e) {
    console.log('🤖 Something went wrong')
    console.log(e)
    await mongoose.connection.close()
  }
}

seedDatabase()
