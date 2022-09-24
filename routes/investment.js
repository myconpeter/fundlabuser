const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {ensureAuthenticated} = require('../config/auth');

router.get('/investnow', ensureAuthenticated, (req, res)=>{
    const isInvest = req.user.isInvested
    if (isInvest === false){
        res.render('investnow')
    } else {
        req.flash('error_msg' , 'YOU HAVE AN ACTIVE INVESTMENT ALREADY');
        res.redirect('/myinvestment');
    }
     });

router.get('/myinvestment', ensureAuthenticated, (req, res)=>{
    res.render('myinvest')
})
    
     module.exports = router;