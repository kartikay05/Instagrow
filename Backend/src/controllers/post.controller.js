const postModel = require("../models/post.model");
const likeModel = require("../models/like.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const cloud = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  try {

    const uploadedFile = await cloud.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: "post",
      folder: "Instagram/Posts"
    });

    const post = await postModel.create({
      caption: req.body.caption,
      imgUrl: uploadedFile.url,
      user: req.user.id
    });

    res.status(201).json({
      message: "Post Added Successfully",
      post
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
}

async function getPostController(req, res) {

  const post = await postModel.find({
    user: req.user.id
  })

  res.status(200).json({
    message: "Post fetched successfully",
    post
  })

}

async function getPostDetailsController(req, res) {

  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId)

  if (!post) {
    return res.status(404).json({
      message: "Post Not Found."
    })
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content."
    })
  }

  res.status(200).json({
    message: "Post Fetched Successfully",
    post
  })
}

async function likePostController(req, res) {
  try {
    const username = req.user.username;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post Not Found."
      });
    }

    // Check if already liked
    const existingLike = await likeModel.findOne({
      post: postId,
      user: username
    });

    // If already liked → Unlike
    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);

      return res.status(200).json({
        message: "Post Unliked Successfully!"
      });
    }

    // Else → Like
    const like = await likeModel.create({
      post: postId,
      user: username
    });

    return res.status(200).json({
      message: "Post Liked Successfully!",
      like
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
}


module.exports = { createPostController, getPostController, getPostDetailsController, likePostController };
