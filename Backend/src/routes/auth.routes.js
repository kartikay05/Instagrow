const express = require('express')
const authController = require('../controllers/auth.controller')
const identifyUser = require('../middlewares/auth.middleware')

const authRouter = express.Router();

/*
*POST /api/auth/register
*/
authRouter.post('/register', authController.registerController);

/*
*POST /api/auth/login
*/
authRouter.post('/login', authController.loginController);


/*
*GET api/auth/get-me
*/

authRouter.get('/get-me', identifyUser, authController.getMeController)
module.exports = authRouter;