const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Withdrawal = require('../models/Withdrawal');
const Deposit = require('../models/Deposit');

const {ensureAuthenticated} = require('../config/auth');

// router.get('/withdraw', ensureAuthenticated, (req, res)=>{
//     const bal = req.user.availableBalance

// if(bal <= 0){
//     req.flash('error_msg' , 'Your current balance is too low, Please make deposit using the depodit link, Thanks');

// }


// res.render('withdrawForm') 
    
//     })
    
router.post('/withdraw',ensureAuthenticated, (req,res)=>{
            const {email, amount, wallet, payment_method} = req.body;
            let errors = [];
            if(!email, !amount || !wallet || !payment_method  ) {
                errors.push({msg : "Please fill in all fields"})
            }
          if(errors.length > 0 ) {
            res.render('withdrawForm', {
                errors : errors,
                email : email,
                amount : amount,
                wallet : wallet,
                payment_method : payment_method,
                
            })
             } 
        const newWithdrawal = new Withdrawal({
            email : email,
            amount : amount,            
            wallet : wallet,            
            payment_method : payment_method,
            user : req.user,  
        });

        newWithdrawal.save()
        .then((value)=>{
            const totalAmount = req.user.availableBalance;
            const idd = req.user.id;
            const reset = 0;
            User.findByIdAndUpdate(idd, {totalAmount : reset }, function(err, data){
                if (err){
                    console.log(err)
                }else{
                    req.flash('success_msg','You have Successfilly Placed a withdrawal');
                    res.redirect('/myinvestment');
                }
            })
        })
        .catch(value=> console.log(value));                
         }
   )
             

   router.post('/paynow',ensureAuthenticated, (req,res)=>{
    const {email, amount, payment_method} = req.body;
    let errors = [];
    if(!email || !amount || !payment_method  ) {
        errors.push({msg : "Please fill in all fields"})
    }
  if(errors.length > 0 ) {
    res.render('paymentform', {
        errors : errors,
        email  : email,
        amount : amount,
        payment_method : payment_method,
        
    })
     } 
const newDeposit = new Deposit({
    email : email,
    amount : amount,            
    payment_method : payment_method,
    user : req.user,  
});

newDeposit.save()
.then((value)=>{
    const totalAmount = req.user.availableBalance;
    const idd = req.user.id;
    const reset = 0;
    User.findByIdAndUpdate(idd, {totalAmount : reset }, function(err, data){
        if (err){
            console.log(err)
        }else{
            req.flash('success_msg','Please Pay to the below Address');
            res.redirect('/pamentdetails');
        }
    })
})
.catch(value=> console.log(value));                
 }
)
     


module.exports = router; 