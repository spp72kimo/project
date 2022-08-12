const { json } = require("body-parser");
const User = require("../models/userAuth");

const listController = {
  handleSave: (idKind, list) => {
    User.updateOne({ idKind }, { todoList: list }).then((result) => {
      if (result.n === 0) {
        return res.json({ ok: 0 });
      }
      req.flash("saveMessage", "儲存成功");
      return res.json({ ok: 1 });
    });
  },
  save: (req, res) => {
    const { googleID, facebookID } = req.session.user;
    const list = JSON.stringify(req.body);
    if (googleID) return this.handleSave(googleID, list);
    if (facebookID) return this.handleSave(facebookID, list);
  },

  load: (req, res) => {
    if (!req.session.user.todoList) {
      req.flash("errorMessage", "您無任何存檔");
      return res.json({ ok: 0 });
    }
    return res.json({
      ok: 1,
      todoList: req.session.user.todoList,
    });
  },
};

module.exports = listController;
