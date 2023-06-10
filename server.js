const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./schemas/teams');

const app = express();
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const DATABASE_URL = 'mongodb+srv://vibhanshu03:vibhanshu03@cluster0.v8llplh.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB: ' + err));

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
      .then((foundUser) => {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password)
            .then((passwordMatch) => {
              if (passwordMatch) {
                console.log('User ' + foundUser.email + ' has been successfully logged in');
                res.status(200).json({
                  message: 'Successfully logged in',
                  data: foundUser,
                });
              } else {
                res.status(401).json({
                  message: 'Incorrect password',
                });
                console.log('Incorrect password');
              }
            })
            .catch((error) => {
              res.status(500).json({
                message: 'Internal server error',
              });
              console.log(error);
            });
        } else {
          res.status(404).json({
            message: 'User not found',
          });
          console.log('User not found');
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Internal server error',
        });
        console.log(error);
      });
  });
   

  app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds)
        .then((hash) => {
          const newUser = new User({
            email,
            username,
            password: hash, // Store the hashed password in the database
          });
          newUser
            .save()
            .then((user) => {
              console.log('User ' + user.email + ' has been successfully added');
              res.status(200).json({
                message: 'Successfully registered',
                data: user,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                message: 'Internal server error',
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: 'Internal server error',
          });
        });
    }
  });
  


  app.post('/update-profile', async (req, res) => {
    const { username, details } = req.body;
  
    try {
      // Find the user based on the provided username
      const user = await User.findOne({ username });
  
      if (user) {
        // Update the user's details
        user.details = details;
        const updatedUser = await user.save();
  
        res.status(200).json({
          message: 'Profile updated successfully',
          data: updatedUser,
        });
      } else {
        res.status(404).json({
          message: 'User not found',
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
      console.log(error);
    }
  });
  

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
