const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    asset: {
        required: true,
        type : Array
    }
})

module.exports = mongoose.model('Data', dataSchema)