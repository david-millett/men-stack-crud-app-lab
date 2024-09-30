const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
require('dotenv/config')

// ! -- Variables

const app = express()
const port = 3000

// ! -- Models

const Fish = require('./models/fish.js')

// * -- Routers/Controllers
const fishRouter = require('./controllers/fish.js')
const authRouter = require('./controllers/auth.js')

// ! -- Middleware

app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)

// ! -- Route handlers

// * -- Landing page
app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user
    })
})

// * -- VIP fish shop
app.get('/fish-shop', (req, res) => {
    if (req.session.user) {
        res.send(`${req.session.user.username}, check out our fish for sale!`)
    } else {
        res.send('Sorry, you need to register to view this content.')
    }
})

// * -- Routers
app.use('/fish', fishRouter)
app.use('/auth', authRouter)

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