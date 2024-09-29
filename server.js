const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
require('dotenv/config')

// ! -- Variables

const app = express()
const port = 3000

// ! -- Models

const Fish = require('./models/fish.js')

// ! -- Middleware

app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.static('public'))

// ! -- Route handlers

// * -- Create route

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

// * -- Read routes

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
app.get('/fish/:fishId', async (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.fishId)) {
            const foundFish = await Fish.findById(req.params.fishId)
            if (!foundFish) return next()
            return res.render('fish/show', { fish: foundFish })
        } else {
            next()
        }      
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred</h1>')        
    }
})

//Edit page
app.get('/fish/:fishId/edit', async (req, res) => {
    try {
        const foundFish = await Fish.findById(req.params.fishId)
        return res.render('fish/edit', {
            fish: foundFish
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
})



// * -- Update route

app.put('/fish/:fishId', async (req, res) => {
    try {
        req.body.isCarnivorous = !!req.body.isCarnivorous
        req.body.temperature = Number(req.body.temperature)
        const foundFish = await Fish.findByIdAndUpdate(req.params.fishId, req.body)
        return res.redirect(`/fish/${req.params.fishId}`)
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error has occurred')
    }
})

// * -- Delete route

app.delete('/fish/:fishId', async (req, res) => {
    try {
        await Fish.findByIdAndDelete(req.params.fishId)
        return res.redirect('/fish')
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
})


// ! -- 404 error handlers

app.get('*', (req, res) => {
    return res.status(404).render('404')
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