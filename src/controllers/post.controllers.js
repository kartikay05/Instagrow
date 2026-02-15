const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const { toFile } = require("@imagekit/nodejs");

const cloud = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  try {
    const { caption } = req.body;

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded = null
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = decoded.id;

    const uploadedFile = await cloud.files.upload({
      file: await toFile(req.file.buffer, "file"),
      fileName: "post",
      folder: "Instagram/Posts"
    });

    const post = await postModel.create({
      caption,
      imgUrl: uploadedFile.url,
      user: userId
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
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({
      message: "Token Invalid",
      error
    })
  }

  const userId = decoded.id;

  const post = await postModel.find({
    user: userId
  })

  res.status(200).json({
    message: "Post fetched successfully",
    post
  })

}

async function getPostDetailsController(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized Access!"
    })
  }

  let decoded = null
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
      error: error.message
    })
  }

  const userId = decoded.id;
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

module.exports = { createPostController, getPostController, getPostDetailsController };
