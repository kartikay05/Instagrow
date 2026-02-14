const express = require('express')
const postController = require('../controllers/post.controllers');
const postRouter = express.Router();
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })


postRouter.post('/test', upload.single('Image'), (req, res)=>{
    console.log(req.body, req.file)
    res.status(200).json({
        message: "This is the post test Api."
    })
})

postRouter.post('/', upload.single('Image'), postController.createPostController)



module.exports = postRouter