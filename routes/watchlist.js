const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');

//show movies from watchlist
router.get('/', function (req, res) {
    res.send('watchlist');
});
//Add movie to watchlist
router.post('/add', (req, res) => {
    let movie = new Watchlist(
        {
            user: req.body.user,
            title: req.body.title
        }
    );
    movie.save(function (err) {
        if (err) {
            return res.send('Error' + err)
        }
        res.send('Movie added successfully')
    })
});
//delete movie from watchlist
router.delete('/', function (req, res) {
    res.send('watchlist');
});

module.exports = router;