const express = require('express')
const authController = require('../controllers/auth.controllers')


const authRouter = express.Router();

// authRouter.post('/test', (req, res) => {
//     console.log(req.body)
//     res.send(req.body)
// })

authRouter.post('/register', authController.registerController);


authRouter.post('/login', authController.loginController);

module.exports = authRouter;