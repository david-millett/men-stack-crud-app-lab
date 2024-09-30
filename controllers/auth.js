const express = require('express')
const bcrypt = require('bcryptjs')

// ! -- Router
const router = express.Router()

// ! -- Model
const User = require('../models/user.js')

// ! -- Routes/Controllers

// * -- Sign up form
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up')
})

// * -- Create user

router.post('/sign-up', async (req, res) => {
    try {
        //check passwords match
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(422).send('The passwords did not match.')
        }
        //hash password
        req.body.password = bcrypt.hashSync(req.body.password, 10)

        //attempt to create user
        const newUser = await User.create(req.body)

        //redirect to sign-in page
        return res.redirect('/auth/sign-in')

        //automatically sign them in

    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            const unique = Object.entries(error.keyValue)[0]
            return res.status(422).send(`${unique[0]} "${unique[1]}" already taken`)
        }
        res.status(500).send('An error occurred.')
    }
})

// * -- Sign in form

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in')
})

// * -- Sign in user

router.post('/sign-in', async (req, res) => {
    try {

        //Check a user exists with the given username
        const userInDatabase = await User.findOne({ username: req.body.username })

        //Invalidate the request with an 'Unauthorized' status if the username is not found
        if (!userInDatabase) {
            return res.status(401).send('Login failed. Please try again.')
        }

        //If the passswords do not match, send an identical response to the 401 above
        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)
        if (!validPassword) {
            return res.status(401).send('Login failed. Please try again.')
        }
        //Create a session to sign the user in
        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id,
        }
        return res.redirect('/')

    } catch (error) {
        console.log(error)
        res.status(500).send('An error has occurred')
    }
})

// * -- Sign out user

router.get('/sign-out', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

// ! -- Export the router

module.exports = router