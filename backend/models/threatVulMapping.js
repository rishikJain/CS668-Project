const mongoose = require('mongoose');

const threatVulMapping = new mongoose.Schema({
    Technique: {
        type: String
    },
    Vuln: {
        type: String
    }
})

module.exports = mongoose.model('threat-vuln-map', threatVulMapping)