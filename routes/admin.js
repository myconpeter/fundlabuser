//==================================================
//admin page
//=================================================

const express = require('express');
const app = express();
const mongoose= require('mongoose');

 const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const passports = require('passport');
const sessions = require('express-session');
const port = 4000; 



var Admin  = require("../models/Admin")

// mongoose connection

mongoose.connect('mongodb://localhost/flamingo', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  useFindAndModify: false,
   useCreateIndex: true
 })
 .then(() => console.log('connected to db'))
.catch((err)=> console.log(err)); 

app.set('view engine','ejs');

// POASSPORT CONFIGURATION
app.use(sessions({
    secret : 'mycon',
    resave : true,
    saveUninitialized : true
}));


app.use(passports.initialize());
app.use(passports.session());

require('../config/passport')

app.use(bodyParser.urlencoded({extended: true}));


app.use((req, res, next) => {
    res.locals.currentAdmin = req.user;
    next();
});




// require('../config/passportx')(passportx)

app.get('/adminpage',  (req, res)=>{
   
    console.log(req.user);
    console.log(res.locals.currentAdmin)
 
     res.render('adminpage' );
 })


app.get('/',  (req, res)=>{
    res.render('adminlogin')
})

app.post('/', function(req, res, next) {
    passports.authenticate('userAdmin', function(err, user, info) {
      if (err) { errors.push({msg : "Invalid username or password"})    }
      if (!user) { return res.redirect('/admin'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        //  console.log(req.user)
        return res.redirect('/admin/adminpage');
      });
    })(req, res, next);
  });


// app.post('/', (req, res, next)=>{

//     passport.authenticate('userAdmin', {
//         successRedirect : '/admin/adminpage',
//         failureRedirect: '/admin',
//         failureFlash : true,
//         session: true
//     })(req,res,next)
//     // console.log(user)


//     })


    // app.post('/', 



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










app.get('/admincreate',  (req, res)=>{
    res.render('admincreate')
})



app.post('/admincreate',(req,res)=>{
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

app.post('/transfer', (req,res)=>{
    const {email,amount} =req.body;
    let errors = [];
    console.log('email: '+ email + '  amount: ' + amount);
    if (!email || !amount){
        errors.push({msg : 'please fill this form to transfer'});
         res.render('adminpage', {currentAdmin : req.user} )
    }
if (isNaN(amount)) {
    errors.push({msg : 'dbhhbk'})
    res.render('adminpage')

}

    if(errors.length > 0 ) {
        res.redirect('/admin/adminpage', {
            errors : errors,
            email : email,
            amount : amount,
    
    
        })
    } else {
        res.send('ujdwfbjehg')
        // if the email is not i database return error
        // find the admin and updata it total amount - amount
        // find the user and add the total amount
        //if succeful send transfer succeful
        //
    }
})

    

    //logout
app.get('/adminlogout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/admin'); 
    });

    function ensureAuthenticated (req, res, next) {
        if(req.isAuthenticated('userAdmin')) {
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




    
   



    module.exports  = app;


app.listen(port, ()=> {
    console.log("Flamingo is now running");
});

//================================================
//admin stop
//===============================================