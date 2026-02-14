const express = require("express")
const cookiePareser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const postRouter = require('./routes/post.routes')

const app = express();
app.use(express.json())
app.use(cookiePareser())

app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)

module.exports = app;
