const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv/config')

// ! -- Variables

const app = express()
const port = 3000

// ! -- Models

const Fish = require('./models/fish.js')

// ! -- Middleware

app.use(express.json())
app.use(morgan('dev'))
app.set('view engine', 'ejs')


// ! -- Route handlers

// * -- Create

// * -- Read

app.get('/', async (req, res) => {
    res.render('index')
})

// * -- Update

// * -- Delete

// ! -- 404 error handlers

// ! -- Server connections

const startServers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connection established')
        app.listen(port, () => {
            console.log(`Listening on port ${port}!`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServers()