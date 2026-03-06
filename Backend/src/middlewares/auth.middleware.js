const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    let decoded = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            authenticated: false
        })
    }

    req.user = decoded;
    next();
}

/* req.user */
module.exports = identifyUser;