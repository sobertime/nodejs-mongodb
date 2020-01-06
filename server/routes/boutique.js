const express = require('express');
const router = express.Router();
// Boutique / Category model
const Boutique = require('../models/Boutique');
const Category = require('../models/Category');
// auth Config
const { ensureAuthenticated } = require('../config/auth');

//category
router.get('/category_create',ensureAuthenticated,(req,res)=>{
  if(req.user.admin === true){
    Category.find({},(err,category) =>{
      if(err) throw err;
      res.render('category_create',{category:category});
    }).sort({ category : 1 });
  }else if(req.user.admin === false){
    res.render('non_admin');
  }
});
router.post('/category_create',ensureAuthenticated,(req,res) =>{
  const { category } = req.body;
  const newCategory = new Category({
    category
  });
  newCategory.save().then(category=>{
    res.redirect('/category_create');
  });
});
router.post('/category_delete',ensureAuthenticated,(req,res)=>{
  Category.deleteOne({ category: req.body.category },(err)=>{
  if(err) return handleError(err);
  res.redirect('/category_create');
  });
});
// boutique page
router.get('/boutique_create', ensureAuthenticated, (req, res) => {
  if(req.user.admin === true ){
    Category.find({},(err,category) =>{
      if(err) throw err;
      res.render('boutique_create',{category:category});
    });
  }else if (req.user.admin === false){
    res.render('non_admin');
  }
 });

router.post('/boutique_create',ensureAuthenticated,(req,res) => {
  if(req.user.admin === true){
    const { titre, prix, description ,category } = req.body;
    const newBoutique = new Boutique({
      titre,
      prix,
      description,
      category
    });
    newBoutique.save().then(boutique => {
      res.redirect('/boutique');
    });
  }else if(req.user.admin === false){
    res.render('non_admin');
  }

});

router.get('/boutique',ensureAuthenticated,(req,res)=>{
  if(req.user.admin === true){
    Boutique.find({},(err,boutique) =>{
      if(err) throw err;
      res.render('boutique_admin',{boutique:boutique});
    });
  }
  else if(req.user.admin === false ){
    Boutique.find({},(err,boutique) =>{
      if(err) throw err;
      res.render('boutique_user',{boutique:boutique});
  });
 }
});

router.get('/boutique/:id',ensureAuthenticated,(req,res)=>{
  if(req.user.admin === true ){
    Boutique.find({ id_product: req.params.id },(err,product)=>{
      if(err) throw err;
      res.render('product_admin',{product : product });
    });
  }else if (req.user.admin === false){
    Boutique.find({ id_product: req.params.id },(err,product)=>{
      if(err) throw err;
      res.render('product',{product : product });
    });
  }
});
router.post('/product/delete',ensureAuthenticated,(req,res)=>{
  Boutique.deleteOne({ _id : req.body.id},(err) =>{
  if(err) return handleError(err);
  res.redirect('/boutique');
  });
});
router.post('/product/search',ensureAuthenticated , (req,res)=>{
  Boutique.find({ titre : req.body.product},(err,product)=>{
    if(err) throw err;
    res.render('product_search',{product:product});
  });
});
module.exports = router;
