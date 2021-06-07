const express = require("express");
const router = express.Router();
const {
  ensureAuthenticatedasUser,
  ensureAuthenticatedasAdmin,
} = require("../config/auth");

router.get("/", (req, res) => {
    res.render('welcome');
})  

router.get("/dashboard", ensureAuthenticatedasUser, (req, res) => {
  res.render("dashboard", {
    name: req.user.name,
  });
});

router.get("/adminPanel", ensureAuthenticatedasAdmin, (req, res) => {
  res.render("adminPanel" , {users:[]});
});

module.exports = router;
