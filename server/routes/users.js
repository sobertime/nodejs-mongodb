const express = require('express');
const router = express.Router();
const passport = require('passport');
const sha1 = require('sha1');
// User model
const User = require('../models/User');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { login, email, password, password2 } = req.body;
  let errors = [];

  if (!login || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      login,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          login,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          login,
          email,
          password,
          admin : "false"
        });
          newUser.password = sha1(newUser.password);
          newUser.save().then(user => {
            req.flash('success_msg','You can log in now');
            res.redirect('/login');
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profil',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});
// users gestion
router.get('/admin', ensureAuthenticated,(req,res)=>{
  if(req.user.admin === true){
        User.find({},(err,user)=>{
      res.render('admin',{user:user});
    }).sort({ login : 1});
  }else if(req.user.admin === false) {
    res.render('non_admin');
  }
});
router.post('/admin/delete',ensureAuthenticated,(req,res)=>{
  if(req.user.admin === true){
    User.deleteOne({ email : req.body.user },(err)=>{
      if(err) return handleError(err);
      req.flash('success_msg', 'User '+ req.body.name + ' is removed !');
      res.redirect('/admin');
    });
  }else if(req.user.admin === false) {
    res.render('non_admin');
  }
});
router.post('/admin/upgrade',ensureAuthenticated,(req,res)=>{
  if(req.user.admin === true){
    User.updateOne({ email : req.body.user},{ admin : true},(err)=>{
      if(err) return handleError(err);
      req.flash('success_msg',  req.body.name + ' is Admin now!');
      res.redirect('/admin');
    });
  }else if(req.user.admin === false) {
    res.render('non_admin');
  }
});
router.post('/admin/downgrade',ensureAuthenticated,(req,res)=>{
  if(req.user.admin === true ){
    User.updateOne({ email : req.body.user},{ admin : false},(err)=>{
      if(err) return handleError(err);
      req.flash('success_msg', 'removed '+req.body.name+ ' Admin permission');
      res.redirect('/admin');
    });
  }else if(req.user.admin === false) {
    res.render('non_admin');
  }
});
module.exports = router;
