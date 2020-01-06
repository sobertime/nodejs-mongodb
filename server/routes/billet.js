const express = require('express');
const router = express.Router();
// model
const Billet = require('../models/Billet');
const Commantaire = require('../models/Commantaire');
// auth Config
const { ensureAuthenticated } = require('../config/auth');

// billet page
// router.get('/billet',ensureAuthenticated, (req,res) => res.render('billet'));
router.get('/billet_create', ensureAuthenticated, (req, res) => res.render('billet_create'));


router.post('/billet_create',(req,res) => {
  const { titre , content , owner } = req.body;
  const newBillet = new Billet({
    titre,
    content,
    owner
  });
  newBillet.save().then(billet => {
    res.redirect('/billet/'+req.body.owner);
  });
});
router.get('/billet',(req,res)=>{
  Billet.find({},(err,billet)=>{
    if(err) throw err
    res.render('billet',{ billet : billet });
  });
});
// blog by user
router.get('/billet/:email', ensureAuthenticated ,(req,res) => {
  Billet.find({owner : req.params.email },(err,billet) =>{
    if(err) throw err
    res.render('billet_by_user',{ billet : billet });
  });
});
//delete
router.post('/billet/delete',ensureAuthenticated,(req,res) =>{
  Billet.deleteOne({ _id : req.body.id },(err)=>{
    if(err) return handleError(err);
    res.redirect('/billet/' + req.body.email);
  });
});
 // find blog editer
router.get('/billet/edit/:id',ensureAuthenticated,(req,res)=>{
  Billet.find({ _id : req.params.id },(err,billet)=>{
    res.render('billet_edit',{billet : billet });
  });
});
router.post('/billet/edit/:email', ensureAuthenticated , (req,res) => {
  Billet.find({ _id : req.body.id },(err,billet) =>{
    if(err) throw err
    Billet.updateOne({ _id : billet[0]._id},{ titre: req.body.titre ,content : req.body.content },(err)=>{
      if(err) return handleError(err);
      res.redirect('/billet/'+ billet[0].owner);
    });
  });
});

//commantaire
router.post('/commantaire',ensureAuthenticated , (req,res)=>{
  const{ id_billet , commantaire} = req.body;
  const newCommantaire = new Commantaire({
  id_billet,
  post_by : req.user.email,
  commantaire
  });
  newCommantaire.save().then(commantaire=>{
    res.redirect('/billet/detail/'+req.body.id_billet);
  })
});
// detail billet
router.get('/billet/detail/:id',ensureAuthenticated,(req,res)=>{
  Billet.find({ _id : req.params.id },(err,billet)=>{
    if(err) throw err
    Commantaire.find({ id_billet : req.params.id },(err,comm)=>{
    if(err) throw err
    res.render('detail_billet',{ billet : billet,comm : comm});
    });
  });
});
// search billet
router.post('/billet/find', ensureAuthenticated , (req,res) =>{
  Billet.find({ titre : req.body.search },(err,billet) =>{
    if(err) throw err
    res.render('billet_find',{ billet : billet });
  });
});
module.exports = router;
