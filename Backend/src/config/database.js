const mongoose = require('mongoose')


async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected To Database!')
    } catch (error) {
        console.log("Failed to connect to Database", error)
        
        res.status(409).json({
            message: "Failed to conneced to Databse."
        })
    }
}


module.exports = connectToDb;