const express = require("express");
const router = express.Router();
const passport = require ("passport");
const User = require("../models/user")
const {ensureAuthenticated} = require('../config/auth');


router.get('/', (req, res)=>{
    
    res.render('index', {currentUser: req.user})
});

router.get('/legal', (req, res)=>{
    res.render('legal')
});



router.get('/affliate', (req, res)=>{
    res.render('Affliate')
});





router.get('/about', (req, res)=>{
    res.render('about')
});

router.get('/trading', (req, res)=>{
    res.render('trading')
});

router.get('/investment', (req, res)=>{
    res.render('investmentHomePage')
});



router.get('/deposithistory', ensureAuthenticated, (req, res)=>{
    res.render('DepositHistory')
});

router.get('/depositePlan', ensureAuthenticated, (req, res)=>{
    res.render('depositPlan')
});

router.get('/withdrawForm', ensureAuthenticated, (req, res)=>{
    res.render('withdrawForm')
});

router.get('/withdrawalHistory', ensureAuthenticated, (req, res)=>{
    res.render('withhostory')
});

router.get('/referral', ensureAuthenticated, (req, res)=>{
    res.render('referral')
});

router.get('/pamentdetails', ensureAuthenticated, (req, res)=>{
    res.render('payment')
});

router.get('/contact', (req, res)=>{
    res.render('contact')
});






module.exports = router;