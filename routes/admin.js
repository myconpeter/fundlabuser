//==================================================
//admin page
//=================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const app = express();


var Admin  = require("../models/Admin")

app.set('view engine','ejs');




router.use((req, res, next) => {
    res.locals.currentAdmin = req.user;
    next();
});




// require('../config/passportx')(passportx)



router.get('/',  (req, res)=>{
    res.render('adminlogin')
})

router.post('/', function(req, res, next) {
    passport.authenticate('userAdmin', function(err, user, info) {
      if (err) { errors.push({msg : "Invalid username or password"})    }
      if (!user) { return res.redirect('/admin'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.render('adminpage',{currentAdmin : req.user});
      });
    })(req, res, next);
  });


// router.post('/', (req, res, next)=>{
//     passport.authenticate('userAdmin',{
//         successRedirect : '/admin/adminpage',
//         failureRedirect: '/admin',
//         failureFlash : true
//     })(req,res,next)

//     console.log(req.user)

//     })


    // router.post('/', 



//   passport.authenticate('userAdmin'),
//   function(req, res) {
     
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.render('adminpage', {currentAdmin : req.user});
//    console.log(req.user)
//   });

//   passport.authenticate('userAdmin', { successRedirect: '/admin/adminpage',
//                                    failureRedirect: '/admin',
//                                    failureFlash: true })
// );


router.get('/adminpage',   (req, res)=>{
     console.log(req.user)
    res.render('adminpage',);
})







router.get('/admincreate',  (req, res)=>{
    res.render('admincreate')
})



router.post('/admincreate',(req,res)=>{
    const {email, password,transferAmount} = req.body;
    let errors = [];
    console.log( 'email :' + email+ ' pass:' + password +  'tranAmt:' + transferAmount );
    if(!email || !password || !transferAmount) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length > 0 ) {
    res.render('admincreate', {
        errors : errors,
        email : email,

        password : password,
        transferAmount : transferAmount


    })
     } else {
        //validation passed
       Admin.findOne({email : email}).exec((err, admin)=>{
        console.log(admin);   
        if(admin) {
            errors.push({msg: 'Admin - email already registered'});
            res.render('admincreate',{email,password,transferAmount})  
           } else {
            const newAdmin = new Admin({

                email : email,
                password : password,
                transferAmount : transferAmount


            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newAdmin.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newAdmin.password = hash;
                    //save user
                    newAdmin.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered as an admin!');
                        res.redirect('/admin');
                    })
                    .catch(value=> console.log(value));

                      
                }));
             }
       })
    }
    })







//================================================
//---SIGN IN ROUTE END HERE----
//===============================================

    

    //logout
router.get('/adminlogout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/admin'); 
    }) 

    function ensureAuthenticated (req, res, next) {
        if(req.isAuthenticated()) {
            next()
        } else {
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/admin');
    }
    };



    function isPermittedTo(req, res, next) {
        if (req.isAuthenticated()){
    
            Admin.findOne({email : email}).exec((err, admin)=>{
                console.log(admin)
                
    
            if (err) {
            res.render("admincreate");
            } else {
            //does the user own the campground
            if (admin.password.equals(req.admin.password)) {
            next();
            }   else {
               res.render("adminlogin");
            }
    
    
            }
            });
    
            } else { 
            res.redirect("/admin")
    
            }
            }




    
   



    module.exports  = router;




//================================================
//admin stop
//===============================================