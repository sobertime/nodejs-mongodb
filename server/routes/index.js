const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Billet = require('../models/Billet');

// Welcome Page
router.get('/',(req,res)=>{
  Billet.find({},(err,billet)=>{
    if(err) throw err
    res.render('welcome',{ billet : billet });
  });
});

// Profil
router.get('/profil', ensureAuthenticated, (req, res) =>
  res.render('profil', {
    user: req.user
  })
);
// BILLET
router.get('/billet_create', ensureAuthenticated, (req, res) =>
  res.render('billet_create', {
    user: req.user
  })
);
module.exports = router;
