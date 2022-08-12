const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 50,
  },
  googleID: {
    type: String,
  },
  facebookID: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  todoList: {
    type: String,
  },
});

module.exports = mongoose.model("userAuth", userSchema);
