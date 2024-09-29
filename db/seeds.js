//Imports
const mongoose = require('mongoose')
require('dotenv/config')

//Models
const Fish = require('../models/fish.js')

//Data
const fishData = require('./data/fish.js')

//Run seeds
const runSeeds = async () => {
    try {
        //Connect to the database
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connection established')
        
        //Clear existing data
        const deletedFish = Fish.deleteMany()
        console.log(`${(await deletedFish).deletedCount} fish deleted from the database`)
        
        //Add new data
        const fish = await Fish.create(fishData)
        console.log(`${fish.length} added to the database`)

        //Close connection to the database
        await mongoose.connection.close()
        console.log('Closing connection to MongoDB')

    } catch (error) {
        console.log(error)
    }
}

runSeeds()