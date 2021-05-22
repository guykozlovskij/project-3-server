import express from 'express'
import userController from '../controllers/usersController.js'



const router = express.Router()
// ? USER
router.route('/register')
  .post(userController.register)




export default router