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
  const { name, email, password } = req.body
  //validate
  if (!name || !email || !password) {
    res.status(401).json({ msg: 'Please enter all fields!' })
    //create new user
  } else {
    const userData = {
      email: email,
      name: name,
      password: password
    }
    //check if user exists otherwise create user 
    User.findOne({
      email: email
    })
      .then(user => {
        if (!user) {
          bcrypt.hash(password, 10, (err, hash) => {
            userData.password = hash
            User.create(userData)
              .then(user => {

                let token = jwt.sign(
                  { id: user.id, name: user.name, email: user.email },
                  'jwtsecret', {
                    expiresIn: 1600
                  })
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                  }
                })
                res.status(200).json({ status: user.email + ' is now registered' })
              })
              .catch(err => {
                res.send('Error' + err)
              })
          })
        } else {
          res.status(401).json({ error: 'User already exists' })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  }
})

//Post to login user
router.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign({ id: user.id, email: user.email, name: user.name }, 'jwtsecret', {
            expiresIn: 1600
          })
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          })
        } else {
          res.status(401).json({
            status: 'Email and password do not match'
          })
        }
      } else {
        res.status(401).json({ status: 'User does not exist' })
      }
    })
    .catch(err => {
      res.send('error:' + err)
    })
})

module.exports = router;
