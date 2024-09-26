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

app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(express.static('public'))


// ! -- Route handlers

// * -- Create

app.post('/fish', async (req, res) => {
    try {
        if (req.body.isCarnivorous) {
            req.body.isCarnivorous = true
        } else {
            req.body.isCarnivorous = false
        }
        req.body.temperature = Number(req.body.temperature)
        const aFish = await Fish.create(req.body)
        console.log(aFish)
        res.redirect('/fish/new')
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
    
})

// * -- Read

//Landing page
app.get('/', async (req, res) => {
    res.render('index')
})

//New page (form page)
app.get('/fish/new', (req, res) => {
    res.render('fish/new')
})

// * -- Update

// * -- Delete

// ! -- 404 error handlers

app.get('*', (req, res) => {
    return res.status(404).send('Page not found')
})

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