//Imports
const mongoose = require('mongoose')
require('dotenv/config')

//Models
const Fish = require('../models/fish.js')
const User = require('../models/user.js')

//Data
const fishData = require('./data/fish.js')
const userData = require('./data/users.js')

//Run seeds
const runSeeds = async () => {
    try {
        //Connect to the database
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('🔒 Database connection established')
        
        //Clear existing data
        const deletedFish = await Fish.deleteMany()
        console.log(`❌ ${(deletedFish).deletedCount} fish deleted from the database`)
        
        //Clear existing users
        const deletedUsers = await User.deleteMany()
        console.log(`❌ ${(deletedUsers).deletedCount} users deleted from the database`)

        //Add new users
        const users = await User.create(userData)
        console.log(`👤 ${users.length} users added to the database`)

        //Add owner field to each event using the users array above
        const fishWithOwners = fishData.map(fish => {
            fish.owner = users[Math.floor(Math.random() * users.length)]._id
            return fish
        })

        //Add new fish data
        const fish = await Fish.create(fishWithOwners)
        console.log(`🐟 ${fish.length} fish added to the database`)

        //Close connection to the database
        await mongoose.connection.close()
        console.log('Closing connection to MongoDB')

    } catch (error) {
        console.log(error)
    }
}

runSeeds()