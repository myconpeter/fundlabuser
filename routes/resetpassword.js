const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

router.get('/forgetpassword', (req, res)=>{
    res.render('forgetpassword')
});

router.post('/forgetpassword',(req,res)=>{
    const {email, username} = req.body;
    let errors = [];
    if(!email || !username) {
        errors.push({msg : "Please input your email and username"})
    }
    if(errors.length > 0 ) {
    res.render('forgetpassword', {
        errors : errors,
        email : email,
        username : username
         })
     } else {
        //validation passed
       User.findOne({email : email, username : username}).exec((err, correctdetails)=>{
        if(!correctdetails) {
            errors.push({msg: 'This email and username does not match'});
            res.render('forgetpassword',{
                errors : errors,
                email : email,
                username : username
            })  
           } else {
            req.flash('success_msg','Please input your Secret and New Password');
               res.redirect('/newpassword')
             }
       })
    }
    });

router.get('/newpassword', (req, res)=>{
    res.render('newpassword')
});

router.post('/newpassword', (req, res)=>{
    var {secret, newpassword }  = req.body
           let errors =[]
           if(newpassword.length < 6 ) {
            errors.push({msg : 'Password atleast 6 characters'})
            }
            if(errors.length > 0 ) {
            res.render('newpassword', {
                errors : errors,
                secret : secret,
                newpassword : newpassword,
            })
             } else {
                 User.findOne({secret : secret}, (err, realUser)=>{
                    if(!realUser){
                        req.flash('error_msg' , 'NOT ALLOWED!!!!');
                            res.redirect('/forgetpassword');
                    } else{
                        const idd = realUser.id;
                        bcrypt.genSalt(10,(err,salt)=> 
                        bcrypt.hash(newpassword,salt,
                            (err,hash)=> {
                                if(err) throw err;
                                    //save pass to hash
                                    newpassword = hash;
                                    console.log(newpassword)
                                    User.findByIdAndUpdate(idd, {password: newpassword },  function(err, data){
                                        if(err){
                                            console.log(err)
                                        } else {
                                            req.flash('success_msg','You have successfully reset your password please login!');
                                            res.redirect('/login')
                                        }
                                    }); 
                                     }));
                         }
                })
              }
}) ;

module.exports = router;