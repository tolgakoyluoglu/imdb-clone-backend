const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

router.use(cors())

// POST route to register a user
router.post('/register', (req, res) => {
  console.log(req.body)
  const userData = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  }

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              res.json({ status: user.email + 'registered' })
            })
            .catch(err => {
              res.send('Error' + err)
            })
        })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//Post to login user
router.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            email: user.email,
            name: user.name
          }
          let token = jwt.sign(payload, 'jwtsecret', {
            expiresIn: 60
          })
          res.send(token)
        } else {
          res.json({ error: 'User does not exist' })
        }
      } else {
        res.json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.send('error:' + err)
    })
})

module.exports = router;
