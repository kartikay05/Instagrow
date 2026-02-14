require("dotenv").config();
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    console.error("Failed to create post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
}

module.exports = { createPostController };
