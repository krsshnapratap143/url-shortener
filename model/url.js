const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shorturl: { type: String, required: true, unique: true },
    longurl: { type: String, required: true },
    visittime: [{ type: String }] // Array of strings for visit times
});

module.exports = mongoose.model('Url', urlSchema);