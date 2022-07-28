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
  thumbnail: {
    type: String,
  },
});

module.exports = mongoose.model("userGoogle", userSchema);
