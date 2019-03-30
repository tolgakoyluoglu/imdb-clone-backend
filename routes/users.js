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
    res.json({ msg: 'Please enter all fields!' })
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
                res.json({ status: user.email + ' registered' })
              })
              .catch(err => {
                res.send('Error' + err)
              })
          })
        } else {
          res.status(400).json({ error: 'User already exists' })
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
          res.json({ error: 'Invalid password' })
        }
      } else {
        res.json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.send('error:' + err)
    })
})


//Update use name
//TODO add email and change password aswell to the CRUD
router.put('/update/:id/', (req, res) => {
  User.findOneAndUpdate(req.params.id, { $set: req.body }, (err, user) => {
    // console.log(name)
    if (err) {
      res.send('Could not be updated')
    } else {
      res.send(User + ' updated')
    }
  })
})

module.exports = router;
