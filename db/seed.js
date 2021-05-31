
// ! This is our little seed program. It is going to connect to mongo DB, then save some
// ! pokemon, then disconnect.
// ? 1) Connect to DB
// ? 2) Seed with data
// ? 3) Disconnect

// ? Import mongoose. This is the INTERFACE between Mongo DB and our program.
import mongoose from 'mongoose'
import connectToDb from './connectToDb.js'

// ! Import my user model and data
import User from '../models/userModel.js'
import Artist from '../models/artistModel.js'
import Album from '../models/albumModel.js'
import Song from '../models/songModel.js'
import Playlist from '../models/playlistModel.js'

import usersData from './data/userData.js'
import artistData from './data/artistData.js'
import albumData from './data/albumData.js'
import songData from './data/songData.js'


//! for adding songs add source BENSOUND and leadartist 
async function seedDatabase() {
  try {
    // ? Waiting for the connection to mongo db...
    await connectToDb()
    console.log('🤖 Successfully connected to mongo')

    // ? Clear the database every time I seed
    await mongoose.connection.db.dropDatabase()
    console.log('🤖 Removed all pokemon')

    // ! Seed with users
    const users = await User.create(usersData)
    console.log(`🤖 ${users.length} users created!`)
    // console.log(users)

    //! Seed artists
    const artistDataWithUser = artistData.map(artist => {
      return { ...artist, user: users[0] }
    })

    const artists = await Artist.create(artistDataWithUser)

    // console.log(artists[0])

    //! Seed albums

    const albumWithArtistAndUser = albumData.map(album => {
      return { ...album, user: users[0], artists: artists, leadArtist: artists[0]._id }
    })
    // albumWithArtistAndUser.artists.push(artists[0])

    const albums = await Album.create(albumWithArtistAndUser)

    // console.log(albums)
    const commentToAdd = {
      username: users[0]._id,
      text: 'A great song, indeed.'
    }
    //! SONGS 
    const songsWithUser = songData.map(song => {
      return {
        ...song,
        user: users[0]._id,
        singer: artists[0],
        album: albums[0],
        comments: commentToAdd
      }
    })
    // add songs to the database
    const songs = await Song.create(songsWithUser)
    console.log(`${songs.length} songs have been added`)

    // console.log(songs)

    //! create a playlist and add songs to it
    const playlist = await Playlist.create({
      name: 'Bensound Collection',
      text: 'Mix songs from Bensound',
      songs: songs,
      users: users[0],
      type: 'public'
    })
    //TODO remove later
    const samplePlaylist = {
      name: 'Sample',
      text: 'sample description',
      songs: [],
      users: users[0],
      type: 'public'
    }
    for (let i = 0; i < 10; i++) {
      const playlist = await Playlist.create(samplePlaylist)
    }
    // console.log(playlist)
    //! adding the song to an album
    const albumToAddSongTo = await Album.findById(albums[0]._id)
    songs.map(song => {
      albumToAddSongTo.songs.push(song._id)
      albumToAddSongTo.comments.push(commentToAdd)
    })
    const albumWithAddedSongs = await albumToAddSongTo.save()

    // console.log(albumWithAddedSongs)

    //! adding songs to artist 
    const artistToAddSongsTo = await Artist.findById(artists[0]._id)

    // console.log(artistToAddSongsTo)

    songs.map(song => {
      artistToAddSongsTo.songs.push(song._id)
      artistToAddSongsTo.comments.push(commentToAdd)
    })
    //! adding albums to artist
    albums.map(album => {
      artistToAddSongsTo.albums.push(album)
    })
    await artistToAddSongsTo.save()
    //! adding song to user addedSongs

    const userWithSong = await User.findById(users[0]._id)
    songs.map(song => {
      userWithSong.addedSongs.push(song._id)
    })
    const userWithAddedSong = await userWithSong.save()

    // console.log(userWithAddedSong)

    console.log('Songs added to users addedSongs')

    // ? Disconnect once we've finished..
    await mongoose.connection.close()
    console.log('🤖 Disconnected from mongo. All done!')

  } catch (e) {
    console.log('🤖 Something went wrong')
    console.log(e)
    await mongoose.connection.close()
  }
}

seedDatabase()

