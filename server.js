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
        await Fish.create(req.body)
        return res.redirect('/fish')
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

//Index page
app.get('/fish', async (req, res) => {
    try {
        const allFish = await Fish.find()
        console.log(allFish)
        return res.render('fish/index', {
            fish: allFish
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred</h1>')
    }
})

//New page (form page)
app.get('/fish/new', (req, res) => {
    res.render('fish/new')
})

//Show page
app.get('/fish/:fishId', async (req, res) => {
    try {
        const foundFish = await Fish.findById(req.params.fishId)
        res.render('fish/show', { fish: foundFish })
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')        
    }
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