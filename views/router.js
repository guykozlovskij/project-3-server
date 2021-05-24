import express from 'express'
import userController from '../controllers/usersController.js'
// import secureRoute from '../middleware/secureRoute.js'


const router = express.Router()
// ? USER
router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)


router.route('/playlist/:id/')



export default router