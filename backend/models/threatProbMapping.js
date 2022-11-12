const mongoose = require('mongoose');

const threatProbMapping = new mongoose.Schema({
    Technique: {
        type: String
    },
    Probability: {
        type: String
    }
})

module.exports = mongoose.model('threat-prob', threatProbMapping)