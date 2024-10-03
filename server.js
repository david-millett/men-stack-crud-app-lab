const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv/config')

const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')

const User = require('./models/user.js')

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
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        })
    })
)
app.use(passUserToView)
// app.use(async (req, res, next) => {
//     const user = await User.findById(req.session.user._id)
//     req.session.destroy(() => {
//         next()
//     })
// })

// ! -- Route handlers

// * -- Landing page
app.get('/', (req, res) => {
    res.render('index')
})

// * -- VIP fish shop
app.get('/fish-shop', isSignedIn, (req, res) => {
    res.send(`${req.session.user.username}, check out our fish for sale!`)
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