const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const {
  ensureAuthenticatedasUser,
  ensureAuthenticatedasAdmin,
} = require("../config/auth");

const {User} = require('../models/User')
const passport = require('passport')

router.get("/login", (req, res) => {
  res.render('login')
});

router.get("/register", ensureAuthenticatedasAdmin, (req, res) => {
  res.render("register");
});


router.get("/users", async (req, res) => {
  
  const users = await User.find({isAdmin:false});
  console.log(users);
  res.render("adminPanel", {users});
});

router.post('/register', (req, res) => {
  
  const { type, name, email, password, password2, phone_number, company_name, address, district, pincode } = req.body
  console.log(req.body);
  let errors = [];
  let isAdmin = false;
  if(type == 'Admin') {
    isAdmin = true;
  }
  
  // CHECK REQUIRED FIELDS
  if(!type || !name || !email || !password || !password2) {
    errors.push({msg:'Please fill in all fields'})
  }
  
  if(password !== password2) {
    errors.push({msg: 'Passwords do not match'})
  }
  
  if(password.length < 6 ) {
    errors.push({msg: 'Password should be at least 6 characters'})
  }
  
  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ email }).then((user) => {
      if (user) {
        // User Exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          phone_number,
          address,
          company_name,
          district,
          pincode,
          isAdmin
        });
        
        //Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            
            newUser.password = hash;
            
            newUser.save()
            .then((user) => {
              req.flash(
                "success_msg",
                "You are now registered and can log in"
                );
                res.redirect("/adminPanel");
              })
              .catch((err) => console.log(err));
            });
          });
        }
      })
    }
  }),
  
  //Login Handle
  
  router.post("/login", async(req, res, next) => {
    const role = await User.findOne({email:req.body.email})
    let check = "";
    check = role.isAdmin ? "/adminPanel" : "/dashboard";
    passport.authenticate("local", {
      successRedirect: check,
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  }),
  
  router.get('/userJson/:id', (req, res) => {
    res.json({user: req.params.id})
  })
  
  //Logout Handle
  
  router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    console.log(req);
    res.redirect('/login')
  })
  
  
  module.exports = router
