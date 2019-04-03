const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: false }
})

module.exports = mongoose.model('Watchlist', WatchlistSchema);