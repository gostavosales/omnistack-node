const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordiantes: {
        type: [Number],
        required: true
    }
});

mongoose.exports = PointSchema;