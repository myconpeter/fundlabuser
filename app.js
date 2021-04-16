const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const expressEjsLayout = require('express-ejs-layouts');

const mongoose= require('mongoose');
const passport = require ('passport');

const bcrypt = require('bcrypt');

const session = require('express-session');

const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Admin = require('./models/Admin');
const Withdrawal = require('./models/Withdrawal')



const {ensureAuthenticated} = require('./config/auth') 



const methodOverride = require("method-override");
const flash = require("connect-flash");


const PORT  = process.env.PORT || 8000;


//passport config:
require('./config/passport')
// require('./config/passportx')(passportx)


// mongoose connection

//  mongoose.connect('mongodb+srv://flamingo:123456789@cluster0.0afwt.mongodb.net/flamingo?retryWrites=true&w=majority', {
//     useUnifiedTopology: true,
//    useFindAndModify: false,
//    useCreateIndex: true
//  });

mongoose.connect('mongodb://localhost/flamingo', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  useFindAndModify: false,
   useCreateIndex: true
 })
 .then(() => console.log('connected to db'))
.catch((err)=> console.log(err)); 


//EJS
app.set('view engine','ejs');
//app.use(expressEjsLayout);



 // POASSPORT CONFIGURATION
 app.use(session({
    secret : 'mycon',
    resave : true,
    saveUninitialized : true
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));






app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res)=>{
    const invest = [
        {name: "Jasper", amount: 5000, returns:"55%", period: "30 days"},
        {name: "Sapphire", amount: 10000, returns:"55%", period: "30 days"},

        {name: "Chalcedony", amount: 20000, returns:"55%", period: "30 days"},
        {name: "Emerald", amount: 50000, returns:"55%", period: "30 days"},
        {name: "Sardonxy", amount: 70000, returns:"55%", period: "30 days"},

        {name: "Sarduis", amount: 100000, returns:"55%", period: "30 days"},
    ]
    res.render('index.ejs', {investplans: invest, currentUser: req.user})
})

app.get('/tips', (req, res)=>{
    res.render('tips')
})


//================================================
//---LOGIN IN ROUTE START----
//===============================================

app.get("/login", (req, res)=>{
    res.render('login')
})







app.post('/login', (req, res, next)=>{
    passport.authenticate('userLocal',{
        successRedirect : '/myinvestment',
        failureRedirect: '/login',
        failureFlash : true
    })(req,res,next)
    })




//================================================
//---LOGIN IN ROUTE STOP----
//===============================================





app.get('/contact', (req, res)=>{
    res.render('contact')
})

app.get('/vendor', (req, res)=>{
    res.render('vendor')
})

app.get('/about', (req, res)=>{
    res.render('about')
})
//================================================
//---SIGN IN ROUTE START----
//===============================================

// TO SHOW THE SIGNUP FORM
app.get('/signup', (req, res)=>{
res.render('signup')
})

// POST NEW USER ROUTE

app.post('/signup',(req,res)=>{
    const {fullname, username, email, password, password2, refcode, secret, telephone} = req.body;
    let errors = [];
    console.log(' fullname:' + fullname+ 'username:' + username + 'email :' + email+ ' pass:' + password + ' refcode:' + refcode + ' secret:' + secret+ ' telephone:' + telephone  );
    if(!fullname || !username || !email || !password || !password2 || !secret || !telephone) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length > 0 ) {
    res.render('signup', {
        errors : errors,
        fullname : fullname,
        username : username,
        email : email,

        password : password,
        password2 : password2,
        refcode : refcode,
        secret : secret,
        telephone : telephone,


    })
     } else {
        //validation passed
       User.findOne({email : email}).exec((err, user)=>{
        console.log(user);   
        if(user) {
            errors.push({msg: 'email already registered, please choose another'});
            res.render('signup',{errors,fullname,username,email,password,password2,refcode,secret,telephone})  
           } else {
            const newUser = new User({
                fullname : fullname,
                username : username,

                email : email,
                password : password,
                refcode : refcode,
                secret : secret,
                telephone : telephone

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
                        console.log(value)
                        req.flash('success_msg','You have now registered!');
                        res.redirect('/login');
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
//


//===========================================
// forget password route
//======================================
app.get('/forgetpassword', (req, res)=>{
    res.render('forgetpassword')
})

app.post('/forgetpassword',(req,res)=>{
    const {username, secret} = req.body;
    let errors = [];
    console.log( 'username :' + username+ ' secret:' + secret);
    if(!username || !secret) {
        errors.push({msg : "Please fill in all fields"})

    }
    //check if match
    
    
    //check if password is more than 6 characters
    if(errors.length > 0 ) {
    res.render('forgetpassword', {
        errors : errors,
        username : username,
        secret : secret,
    })
     } else {
        //validation passed
       User.findOne({username : username, secret : secret}).exec((err, correctdetails)=>{
        console.log(correctdetails);   
        if(!correctdetails) {
            errors.push({msg: 'this username and secret does not match'});
            res.render('forgetpassword',{username,secret})  
           } else {
               res.redirect('/newpassword')
    
           
             }
       })
    }
    })

    //check username and secret

    //get username and secret from database
    //if username and secret === the one in the data base
    //send the new password page



app.get('/newpassword', (req, res)=>{
    res.render('newpassword')

})

app.post('/newpassword', (req, res)=>{
    var newpassword = req.body.password
           let errors =[]
           console.log('newpassword ='+ newpassword)
           if(newpassword.length < 6 ) {
            errors.push({msg : 'password atleast 6 characters'})
        }

        if(errors.length > 0 ) {
            res.render('newpassword', {
                errors : errors,
                newpassword : newpassword,
            })
             }  else {

                bcrypt.genSalt(10,(err,salt)=> 
                        bcrypt.hash(newpassword,salt,
                            (err,hash)=> {
                                if(err) throw err;
                                    //save pass to hash
                                    newpassword = hash;
                                    console.log('newpassword : ' + newpassword)

                                    User.updateMany({ password: newpassword },  function(err, data){
                                        console.log(data)
                                        if(err){
                                            console.log(err)
                                        } else {
                                            res.redirect('/login')
                                        }
                                    }); 

                
                   
                

                      
                }));

           }

                        
}) ;



//==========================================
// forget password end
//=========================================


app.get('/withdraw', ensureAuthenticated, (req, res)=>{
    
   res.render('withdrawal') 


})




    app.post('/withdraw',(req,res)=>{
        
        const {acctname, acctnum, bankname, telephone,  secret} = req.body;
        let errors = [];
        console.log(' acctname:' + acctname+ 'acctnum:' + acctnum + 'bankname :' + bankname+ ' telephone:' + telephone + ' secret:' + secret)
        if(!acctname || !acctnum || !bankname || !telephone || !secret ) {
            errors.push({msg : "Please fill in all fields"})
        }
        //check if match
        
        
        //check if password is more than 6 characters
       
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
            //validation passed
           User.findOne({secret : secret}).exec((err, realuser)=>{
            console.log(realuser);   
            if(!realuser) {
                errors.push({msg: 'Please enter your users secret'});
                res.render('withdrawal',{errors,acctname,acctnum,bankname,telephone,secret})  
               } else {
                const newWithdrawal = new Withdrawal({
                    acctname : acctname,
                    acctnum : acctnum,
    
                    bankname : bankname,
                    telephone : telephone,
                    secret : secret,    
                });
                newWithdrawal.save()
                .then((value)=>{
                    console.log(value)
                    req.flash('success_msg','You have successfilly placed a withdrawalal!');
                    res.redirect('/withdraw');
                })
                .catch(value=> console.log(value));                
                 }
           })
        }
        })
    

// check if amount is able to withdraw
    //==========================================
    //==========================================
    //========================================






    //============================================================================================
    //============================================================================================
    //============================================================================================
app.get('/investnow', ensureAuthenticated, (req, res)=>{
    res.render('investnow')
})

app.post('/investnow', ensureAuthenticated, (req, res)=>{
const name = req.body;
// console.log(name)

const totalamt = req.user.totalAmount
// console.log(totalamt)

if (totalamt < 5000 ){
    console.log('cannotbuy')
    res.redirect('/myinvestment');
} else{
    User.updateOne({totalAmount: (totalamt-5000)}, function(err, investuser){
        console.log(investuser)
        if (err){
            console.log(err)
        } else {
            res.redirect('/myinvestment');
        }
    })
}




    // res.render('investnow')
})






    //==============================================================================================
    //==============================================================================================
    //=====================================================================================


app.get('/myinvestment', ensureAuthenticated, (req, res)=>{

    const invest = [
        {name: "Jasper", amount: '5k', returns:"55%", period: "30 days"},
        {name: "Sapphire", amount: '10', returns:"55%", period: "30 days"},

        {name: "Chalcedony", amount: 20000, returns:"55%", period: "30 days"},
        {name: "Emerald", amount: 50000, returns:"55%", period: "30 days"},
        {name: "Sardonxy", amount: 70000, returns:"55%", period: "30 days"},

        {name: "Sarduis", amount: 100000, returns:"55%", period: "30 days"},
    ]
    // console.log(req.user)


    const recieve = req.user.recievedAmount;
    // console.log(recieve);

    const amount = req.user.totalAmount;
    // console.log(amount);

    const total = req.user.totalAmount;
    // console.log(amount);

    const allcash = recieve + amount;
        console.log(allcash);



    User.updateOne({totalAmount: allcash}, function(err, data) {
                           
        console.log(data)

        if (err) {
            console.log('not transfer')
         } //else {
        //     User.updateOne({recievedAmount : 0}, function(err, data){
       
        //     })
        // }
         
    });

    // User.updateOne({recievedAmount : 0}, function(err, data){
       
   // })






    

    res.render('myinvest', {investplans: invest})
})









app.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/'); 
    })

// BASIC FUNCTIONS
// function isLoggedIn (req, res, next) {
// if (req.isAuthenticated()){
//     return next()
// } else {
//     req.flash('error_msg' , 'please login to view this resource');

//     res.redirect('/adminlogin')
// }
// }

function isLoggedIn (req, res, next) {
    res.redirect('/login')
    next()
}



    



app.listen(PORT, ()=> {
    console.log("Flamingo is now running");
});
