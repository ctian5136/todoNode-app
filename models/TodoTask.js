// this is the set up of how the data will look in the database
const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('TodoTask',todoTaskSchema);