const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Withdrawal = require('../models/Withdrawal');
const {ensureAuthenticated} = require('../config/auth');

router.get('/withdraw', ensureAuthenticated, (req, res)=>{
const total = req.user.totalAmount;
const investment = req.user.isInvested;
const Withdrawable = req.user.isWithdrawable

if(investment == true){
    req.flash('error_msg' , 'You have an active investment, Please wait for Completion of your package, Thanks');
        res.redirect('/myinvestment');
    } 

    else if (Withdrawable == false){
        req.flash('error_msg' , 'You cannot withdraw this amount, please review our faqs for more explanation');
        res.redirect('/myinvestment');
    }
 
    else if (total < 1000){
        req.flash('error_msg' , 'You cannot withdraw this amount, Please fund your account');
        res.redirect('/myinvestment');
    }else{
        res.render('withdrawal') 
    
    }
 
})
    
router.post('/withdraw',ensureAuthenticated, (req,res)=>{
            const {email, acctname, acctnum, bankname, telephone, secret} = req.body;
            let errors = [];
            if(!acctname || !email || !acctnum || !bankname || !telephone || !secret ) {
                errors.push({msg : "Please fill in all fields"})
            }
          if(errors.length > 0 ) {
            res.render('withdrawal', {
                errors : errors,
                acctname : acctname,
                acctnum : acctnum,
                bankname : bankname,
        
                telephone : telephone,
                secret : secret,
            })
             } else {
                User.findOne({email: email}, (err, withdraw)=>{
                    if (err){
                        console.log(err)
                    } else{
 //validation passed
 User.findOne({secret : secret}).exec((err, realuser)=>{
    if(!realuser) {
        errors.push({msg: 'Please enter your users secret'});
        res.render('withdrawal',{errors,acctname,acctnum,bankname,telephone,secret})  
       } else {
           const mmm = req.user.totalAmount
        const newWithdrawal = new Withdrawal({
            email   : email,
            acctname : acctname,
            acctnum : acctnum,
            bankname : bankname,
            telephone : telephone,
            secret : secret, 
            amount : mmm, 
            user : req.user,  
        });

        newWithdrawal.save()
        .then((value)=>{
            const totalAmount = req.user.totalAmount;
            const idd = req.user.id;
            const reset = 0;
            User.findByIdAndUpdate(idd, {totalAmount : reset, isWithdrawable : false, withdrawAmount : 0}, function(err, data){
                if (err){
                    console.log(err)
                }else{
                    req.flash('success_msg','You have successfilly placed a withdrawal');
                    res.redirect('/myinvestment');
                }
            })
        })
        .catch(value=> console.log(value));                
         }
   })
                    }
                })
            }
            })

module.exports = router; 