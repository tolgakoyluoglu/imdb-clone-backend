const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
})

module.exports = mongoose.model('Watchlist', WatchlistSchema);