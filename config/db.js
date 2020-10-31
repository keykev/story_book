const mongoose = require('mongoose')
const { db } = require('../models/User')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.Mongo_URI, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useFindAndModify: false
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB

