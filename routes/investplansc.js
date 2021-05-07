const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {ensureAuthenticated} = require('../config/auth');


router.post('/investnow3', ensureAuthenticated, (req, res)=>{
    const totalamount = req.user.totalAmount;
    const invset = 20000;
    const msg = "Chalcedony Package, ROI : 31,000";
    const idd = req.user.id;
    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');
        res.redirect('/myinvestment')
    }else{
        User.findByIdAndUpdate(idd, { totalAmount: (totalamount - invset), withdrawAmount: (totalamount - invset), isInvested: true, currentInvestment: invset, investPlans: msg, investedDate: new Date(), investedMatureDate: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), investmentReturn: 31000 }, (err, possible) => {
           if(err){
               console.log(err)
           } else {
                    const bonus = req.user.refcode;
                    User.findOne({telephone : bonus}, (err, foundRef)=>{
                        const iddd = foundRef.id
                        const isReffered = req.user.isReffered
                        const refTaken = foundRef.refCodeBonus
                        if(isReffered == true){

                        }else if(refTaken == true){

                        } 
                        else {
                            User.findByIdAndUpdate(iddd, { refCodeAmount :1000, refCodeBonus : true }, (err, done)=>{
                                if (err) {
                                    console.log(err)
                                } else {
                                    User.findByIdAndUpdate(idd, {isReffered : true }, (err, done)=>{
                                    })
                                }
                            })
                        }
                    })
            req.flash('success_msg','You have successfully bought an investment plan!');
            res.redirect('/myinvestment');
           }
            }
        )
    }
 });

 // ====================================================================================


router.post('/investnow4', ensureAuthenticated, (req, res)=>{
    const totalamount = req.user.totalAmount;
    const invset = 50000;
    const msg = "Emerald Package, ROI : 77,500";
    const idd = req.user.id;
    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');
        res.redirect('/myinvestment')
    }else{
        User.findByIdAndUpdate(idd, { totalAmount: (totalamount - invset), withdrawAmount: (totalamount - invset), isInvested: true, currentInvestment: invset, investPlans: msg, investedDate: new Date(), investedMatureDate: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), investmentReturn: 77500 }, (err, possible) => {
           if(err){
               console.log(err)
           } else {
                    const bonus = req.user.refcode;
                    User.findOne({telephone : bonus}, (err, foundRef)=>{
                        const iddd = foundRef.id
                        const isReffered = req.user.isReffered
                        const refTaken = foundRef.refCodeBonus
                        if(isReffered == true){

                        }else if(refTaken == true){

                        } 
                        else {
                            User.findByIdAndUpdate(iddd, { refCodeAmount :2500, refCodeBonus : true }, (err, done)=>{
                                if (err) {
                                    console.log(err)
                                } else {
                                    User.findByIdAndUpdate(idd, {isReffered : true }, (err, done)=>{
                                    })
                                }
                            })
                        }
                    })
            req.flash('success_msg','You have successfully bought an investment plan!');
            res.redirect('/myinvestment');
           }
            }
        )
    }
 });
// ====================================================================================

module.exports = router;