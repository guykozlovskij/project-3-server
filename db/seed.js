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
import usersData from './data/userData.js'

import Song from '../models/songModel.js'
import songData from './data/songData.js'

// ? Import my mongoose model for pokemon.
// ? Import my pokemon data...
// import Pokemon from '../models/pokemon.js'
// import pokemonData from './data/pokemon.js'

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
    console.log(users)

    // ? SONGS
    // add user to each song
    const songsWithUser = songData.map((song) => {
      return { ...song, user: users[0]._id }
    })

    // add songs to the database
    const songs = await Song.create(songsWithUser).console.log(
      `${songs.length} songs have been added`
    )
    console.log(songs)
    // TODO add song to the users addedSongs

    // ? Assign a user to each pokemon..
    // const pokemonDataWithUsers = pokemonData.map(pokemon => {
    //   return { ...pokemon, user: users }
    // })

    // console.log(pokemonDataWithUsers)

    // ? Now I can seed my database using mongoose....
    // const pokemon = await Pokemon.create(pokemonDataWithUsers)
    // console.log(`🤖 ${pokemon.length} pokemon created!`)

    // ! --------------------------------------
    // ! Adding a single comment to my first pokemon
    // const myComment = {
    //   text: 'This is my first comment',
    //   user: users[0]._id,
    // }
    // ? Grab pokemon to comment on..
    // const pokemonToCommentOn = pokemon[0]
    // ? Add the comment to the pokemon
    // pokemonToCommentOn.comments.push(myComment)
    // ? Saves the pokemon
    // const savedPokemon = await pokemonToCommentOn.save()
    // console.log(savedPokemon)
    // ! --------------------------------------

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
