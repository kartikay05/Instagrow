const express = require('express')
const userController = require('../controllers/user.controller')
const identifyUser = require('../middlewares/auth.middleware')


const userRouter = express.Router()

/*
* @route POST  api/user/follow/:username
* @description Follow a user
* @access Private
*/
userRouter.post('/follow/:username', identifyUser, userController.followUserController)


/*
* @route POST  api/user/unfollow/:username
* @description Unfollow a user
* @access Private
*/
userRouter.post('/unfollow/:username', identifyUser, userController.unfolllowUserController)

module.exports = userRouter;

