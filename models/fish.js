const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true //this option set to true provides a dynamic createdAt and updatedAt field that upadte automatically
})

const fishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    temperature: Number,
    isCarnivorous: Boolean,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [commentSchema]
})

const Fish = mongoose.model('Fish', fishSchema)

module.exports = Fish
