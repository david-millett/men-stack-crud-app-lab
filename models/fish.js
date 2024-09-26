const mongoose = require('mongoose')

const fishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    diet: String,
    temperature: Number,
    predator: Boolean,
    difficulty: String
})

const Fish = mongoose.model('Fish', fishSchema)

module.exports = Fish