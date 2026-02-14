require('dotenv').config()
const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function registerController(req, res) {
    try {
        const { email, username, password, bio, profileImage } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                message:
                    isUserAlreadyExists.email === email
                        ? "Email already exists"
                        : "Username already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
            bio,
            profileImage
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true });

        res.status(201).json({
            message: "User Registered successfully",
            user: {
                email: user.email,
                username: user.username,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });

    } catch (err) {
        // ✅ Mongoose validation error
        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: err.message
            });
        }

        // ✅ Duplicate key error
        if (err.code === 11000) {
            return res.status(409).json({
                error: "Email or Username already exists"
            });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function loginController(req, res) {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            {
                email: email
            },
            {
                username: username
            }
        ]
    })

    if (!user) {
        res.status(404).json({
            message: "user not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        res.status(401).json({
            message: "Invalid Password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.cookie('token', token)

    res.status(200).json({
        message: "User LoggedIn Successfully",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })

}

module.exports = { registerController, loginController }