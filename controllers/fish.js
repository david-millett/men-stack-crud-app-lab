const mongoose = require('mongoose')
const express = require('express')

// ! -- Router
const router = express.Router()

// ! -- Model
const Fish = require('../models/fish.js')
const isSignedIn = require('../middleware/is-signed-in.js')

//! -- Routes

// * -- Read routes

//Index page
router.get('/', async (req, res) => {
    try {
        const allFish = await Fish.find()
        return res.render('fish/index', {
            fish: allFish
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred</h1>')
    }
})

//New page (form page)
router.get('/new', isSignedIn, (req, res) => {
    res.render('fish/new')
})

//Show page
router.get('/:fishId', async (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.fishId)) {
            const foundFish = await Fish.findById(req.params.fishId).populate('owner')
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
router.get('/:fishId/edit', isSignedIn, async (req, res) => {
    try {
        const foundFish = await Fish.findById(req.params.fishId)

        if (!foundFish.owner.equals(req.session.user._id)) {
            return res.redirect(`/fish/${req.params.fishId}`)
        }

        return res.render('fish/edit', {
            fish: foundFish
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
})

// * -- Create route

router.post('/', isSignedIn, async (req, res) => {
    try {
        if (req.body.isCarnivorous) {
            req.body.isCarnivorous = true
        } else {
            req.body.isCarnivorous = false
        }
        req.body.temperature = Number(req.body.temperature)
        req.body.owner = req.session.user._id //Add the owner ObjectId using the authenticated user's _id (from the session)
        await Fish.create(req.body)
        return res.redirect('/fish')
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
    
})

// * -- Update route

router.put('/:fishId', isSignedIn, async (req, res) => {
    try {
        const fishToUpdate = await Fish.findById(req.params.fishId)
        if (fishToUpdate.owner.equals(req.session.user._id)) {
            req.body.isCarnivorous = !!req.body.isCarnivorous
            req.body.temperature = Number(req.body.temperature)
            await Fish.findByIdAndUpdate(req.params.fishId, req.body)
            return res.redirect(`/fish/${req.params.fishId}`)
        }
        throw new Error('User is not authorised to perform this action.')
       
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error has occurred')
    }
})

// * -- Delete route

router.delete('/:fishId', isSignedIn, async (req, res) => {
    try {
        const fishToDelete = await Fish.findById(req.params.fishId)

        if (fishToDelete.owner.equals(req.session.user._id)) {
            await Fish.findByIdAndDelete(req.params.fishId)
            return res.redirect('/fish')
        }
        throw new Error('User is not authorised to perform this action.')
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
})

// ! -- Comments sections

// * -- Create comment

router.post('/:fishId/comments', async (req, res, next) => {
    try {
        
        //Add signed in user id to the user field
        req.body.user = req.session.user._id

        //Find the fish that we want to add the comment to
        const fish = await Fish.findById(req.params.fishId)
        if (!fish) return next()

        //Push the req.body (new comment) into the comments array
        fish.comments.push(req.body)

        //Need tp save the fish we just added the comment to
        await fish.save()

        return res.redirect(`/fish/${req.params.fishId}`)

    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
})


// * -- Delete comment



module.exports = router