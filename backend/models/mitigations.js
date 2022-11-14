const mongoose = require('mongoose');

const mitigations = new mongoose.Schema({
    Tactic: {
        type: String
    },
    Technique: {
        type: String
    },
    Mitigation: {
        type: String
    },
    MITRE_ID: {
        type: String
    }
})

module.exports = mongoose.model('technique_policy_recommendation', mitigations)