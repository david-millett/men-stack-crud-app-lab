const mongoose = require('mongoose')

const fishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    temperature: Number,
    isCarnivorous: Boolean,
})

const Fish = mongoose.model('Fish', fishSchema)

module.exports = Fish