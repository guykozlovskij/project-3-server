// ? The server actually runs my express app.

import app from './app.js'
import connectToDb from './db/connectToDb.js'


async function startApp() {
  try {
    // ? Connect to mongo db when my app starts..
    await connectToDb()
    console.log('Database has connected!')
    // ? This method will run my app (listen)
    // ? It's 'listening' for requests.
    app.listen(4000, () => console.log('Express is now running'))
  } catch (e) {
    console.log('Something went wrong starting app..')
    console.log(e)
  }
}

startApp()

