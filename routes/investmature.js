const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {ensureAuthenticated} = require('../config/auth');

router.post('/matured/:id', ensureAuthenticated, (req, res)=>{
    const investmentReturn = req.user.investmentReturn;
    const total = req.user.totalAmount;
    const all = investmentReturn + total;
    const msg = " No Active Plan ";

    User.findByIdAndUpdate(req.params.id, {totalAmount : all, isInvested : false, currentInvestment: 0, investPlans : msg, investedDate: 0, investedMatureDate : 0, isWithdrawable : true, withdrawAmount : all}, (err, add)=>{
        if(err){
            console.log(err)
        } else {
            User.findByIdAndUpdate(req.params.id, {investmentReturn : 0}, (err, ok)=>{
                if (err) {
                    console.log(err)
                } else {
                    res.redirect('/myinvestment')
                }
            })
        }
    })
})

module.exports = router;