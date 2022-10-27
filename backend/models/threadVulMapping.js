const mongoose = require('mongoose');

const threatVulMapping = new mongoose.Schema({
    Tactic: {
        type: String
    },
    Technique: {
        type: String
    },
    Vuln: {
        type: String
    }
})

module.exports = mongoose.model('threat-vuln-map', threatVulMapping)