const { json } = require("body-parser");
const User = require("../models/userAuth");

const listController = {
  handleSave: (req, res) => {
    let kindID;
    if (req.googleID) kindID = { googleID: req.googleID };
    if (req.facebookID) kindID = { facebookID: req.facebookID };
    User.updateOne({ kindID }, { todoList: req.list }).then((result) => {
      if (result.n === 0) {
        return res.json({ ok: 0 });
      }
      req.flash("saveMessage", "儲存成功");
      return res.json({ ok: 1 });
    });
  },

  save: (req, res, next) => {
    const { googleID, facebookID } = req.session.user;
    const list = JSON.stringify(req.body);
    if (googleID) req.googleID = googleID;
    if (facebookID) req.facebookID = facebookID;
    req.list = list;
    next();
  },

  load: (req, res) => {
    const user = req.session.user;
    let kindID;
    if (user.googleID) kindID = { googleID: user.googleID };
    if (user.facebookID) kindID = { facebookID: user.facebookID };

    User.findOne({ kindID })
      .then((result) => {
        req.flash("saveMessage", "讀取成功");
        return res.json({
          ok: 1,
          todoList: result.todoList,
        });
      })
      .catch((err) => {
        req.flash("saveMessage", "讀取失敗");
        return res.json({ ok: 0 });
      });
  },
};

module.exports = listController;
