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
         const recieve = req.user.recievedAmount;
         const affliateBonus = req.user.affliateBonus;
         const profit = req.user.profit;
         const priciple = req.user.principle;
         const amount = req.user.availableBalance;


         const allcash = recieve + affliateBonus + profit + priciple + amount  ;
         const idd = req.user.id;
         User.findByIdAndUpdate(idd, {availableBalance: allcash }, (err, money)=>{
             if(err){
                 console.log(err)
             }
     })
    //  User.save();
     User.findByIdAndUpdate(idd, {recievedAmount : 0, refCodeAmount : 0, refCodeBonus : false}, function(err, data){
      })
      res.render('myinvest')
     });

     module.exports = router;