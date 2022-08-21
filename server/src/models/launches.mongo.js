const mongoose = require('mongoose');
//
const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    // refer using primary key
    // this type of approach is suitable in sql joints
    target: {
        type: String
    },
    customers: {
        type: [String],
    },
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }

});
// first argument must be singular
// connect launchesSchema with the launches collection


module.exports = mongoose.model('Launch', launchesSchema);