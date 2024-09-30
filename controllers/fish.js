const mongoose = require('mongoose')
const express = require('express')

// ! -- Router
const router = express.Router()

// ! -- Model
const Fish = require('../models/fish.js')

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
router.get('/new', (req, res) => {
    res.render('fish/new')
})

//Show page
router.get('/:fishId', async (req, res, next) => {
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
router.get('/:fishId/edit', async (req, res) => {
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

// * -- Create route

router.post('/', async (req, res) => {
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

// * -- Update route

router.put('/:fishId', async (req, res) => {
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

router.delete('/:fishId', async (req, res) => {
    try {
        await Fish.findByIdAndDelete(req.params.fishId)
        return res.redirect('/fish')
    } catch (error) {
        console.log(error)
        return res.status(500).send('An error occurred')
    }
})

module.exports = router