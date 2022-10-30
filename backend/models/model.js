const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    asset: {
        required: true,
        type: [String]
    },
    deviceType: {
        required: true,
        type: String
    },
    priority : {
        type : Number
    },
    vulnerabilities: {
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)