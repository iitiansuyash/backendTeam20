const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  details: {
    name: String,
    age: Number,
    gender: String,
    contact: String,
    address: String,
    adhar: String,
    maritalstatus: String,
    incomesource: String,
    incomerange: String,
    children: Number,
    education: String,
    occupation: String,
    occupationtype: String,
    workexperience: String,
    workexperienceposition: String,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
