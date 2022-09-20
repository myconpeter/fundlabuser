const express = require("express");
const router = express.Router();
const passport = require ("passport");
const bcrypt = require('bcrypt');
const User = require("../models/user");

router.get("/login", (req, res)=>{
    res.render('login')
});

router.post('/login', (req, res, next)=>{
    passport.authenticate('userLocal',{
        successRedirect : '/myinvestment',
        failureRedirect: '/login',
        failureFlash : true
    })(req,res,next)
    })

router.get('/signup', (req, res)=>{
        res.render('signup')
        })
                
router.post('/signup',(req,res)=>{
            const {firstname, lastname, username, email, password, password2} = req.body;
            let errors = [];
            if(!firstname || !lastname || !username || !email || !password || !password2) {
                errors.push({msg : "Please fill in all fields"})
            }
            //check if match
            if(password !== password2) {
                errors.push({msg : "Passwords dont match"});
            }
            
            //check if password is less than 6 characters
            if(password.length < 6 ) {
                errors.push({msg : 'Password must be at least 6 characters'})
            }
      
            if(errors.length > 0 ) {
            res.render('signup', {
                errors : errors,
                firstname : firstname,
                lastname : lastname,
                username : username,
                email : email,
        
                password : password,
                password2 : password2,
            })
             } else {
                //  User.findOne({telephone : refcode}).exec((err, ref)=>{
                //     if(!ref) {
                //         errors.push({msg: 'Referral code is invalid'});
                //         res.render('signup',{errors,fullname,username,email,password,password2,refcode,secret,telephone}) 
                //        }  else {
        
                        User.findOne({email : email}).exec((err, user)=>{
                            if(user) {
                                errors.push({msg: 'Email already registered, Please choose another'});
                                res.render('signup',{errors,firstname,lastname,username,email,password,password2})  
                               } else{
                                User.findOne({username : username}).exec((err, phone)=>{
                                        if (phone) {
                                            errors.push({msg: 'Username chosen already registered, Please choose another'});
                                            res.render('signup',{errors,firstname,lastname,username,email,password,password2})  
                                         } else {
                                             User.findOne({username : username}).exec((err, aSecret)=>{
                                                 if (aSecret){
                                                    errors.push({msg: 'Please Input another username'});
                                                    res.render('signup',{errors,firstname,lastname,username,email,password,password2,telephone})          
                                                 }  else {
                                                    const newUser = new User({
                                                        firstname : firstname,
                                                        lastname : lastname,
                                                        username : username,
                                        
                                                        email : email,
                                                        password : password,
                                                    });
                                            
                                        //hash password
                                        bcrypt.genSalt(10,(err,salt)=> 
                                        bcrypt.hash(newUser.password,salt,
                                            (err,hash)=> {
                                                if(err) throw err;
                                                    //save pass to hash
                                                    newUser.password = hash;
                                                //save user
                                                newUser.save()
                                                .then((value)=>{
                                                    req.flash('success_msg','You have now registered, Please login');
                                                    res.redirect('/login');
                                                })
                                                .catch(value=> console.log(value));
                                            }));
                                         }
                                             })
                                         }
                                         
                                
                                       })
                               }
                           })
                      }
                })
            //    }
            // })
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You have successful logout');
    res.redirect('/'); 
    })
        
 module.exports = router;     
        
        