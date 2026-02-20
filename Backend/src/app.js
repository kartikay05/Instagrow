const express = require("express")
const cookiePareser = require('cookie-parser')
const cors = require('cors')

const app = express();
app.use(cookiePareser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))
app.use(express.json())


/* require routes */
const authRouter = require('./routes/auth.routes')
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.routes')


/* used routes*/
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
app.use('/api/user', userRouter)

module.exports = app;
