const mongoose = require('mongoose')

const fishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    temperature: Number,
    isCarnivorous: Boolean,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Fish = mongoose.model('Fish', fishSchema)

module.exports = Fish