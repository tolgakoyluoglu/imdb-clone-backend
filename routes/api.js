var express = require("express");
var router = express.Router();
const axios = require("axios");

//Get search
router.post("/", (req, res) => {
  console.log(req.body);
  const { query } = req.body;
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
    )
    .then(({ data }) => {
      res.json(data);
    });
});

//Get movie
router.post("/movie", (req, res) => {
  const { id } = req.body;
  axios
    .get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}&language=en-US`
    )
    .then(({ data }) => {
      res.json(data);
    });
});

module.exports = router;
