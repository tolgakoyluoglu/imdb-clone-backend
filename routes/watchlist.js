const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');

//show movies from watchlist
router.post('/show', (req, res) => {
    console.log(req.body.user)
    Watchlist.find({
        user: req.body.user
    })
        .then(watchlist => {
            if (watchlist) {
                res.json(watchlist)
                console.log(watchlist)
            }
        });
});
//Add movie to watchlist
router.post('/add', (req, res) => {
    let movie = new Watchlist(
        {
            user: req.body.user,
            title: req.body.title,
            image: req.body.image
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
router.delete('/delete/:id', (req, res) => {
    Watchlist.findById(req.params.id)
        .then(movie => movie.remove()
            .then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }))
})

module.exports = router;