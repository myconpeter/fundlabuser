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
    const {email, username} = req.body;
    let errors = [];
    console.log( 'email :' + email + ' username:' + username);
    if(!email || !username) {
        req.flash('error_msg' , 'Please input your email address and username');

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
       User.findOne({email : email, username : username}).exec((err, correctdetails)=>{
        // console.log(correctdetails.id);   
        if(!correctdetails) {
            errors.push({msg: 'this email and username does not match'});
            res.render('forgetpassword',{email , username})  
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


   

    var {secret, password }  = req.body
           let errors =[]
           console.log('newpassword ='+ password + 'secret:' + secret)
           if(password.length < 6 ) {
            errors.push({msg : 'password atleast 6 characters'})
        }

        if(errors.length > 0 ) {
            res.render('newpassword', {
                errors : errors,
                secret : secret,
                newpassword : newpassword,
            })
             }
             
             
             else {

                User.findOne({secret : secret}, (err, realUser)=>{
                    if(!realUser){
                        req.flash('error_msg' , 'NOT ALLOWED!!!!');

                        res.render('forgetpassword');
                    } else{
                        const idd = realUser.id;
                        console.log(idd)



                        bcrypt.genSalt(10,(err,salt)=> 
                        bcrypt.hash(password,salt,
                            (err,hash)=> {
                                if(err) throw err;
                                    //save pass to hash
                                    password = hash;
                                    console.log('newpassword : ' + password)

                                    User.findByIdAndUpdate(idd, { password: password },  function(err, data){
                                        console.log(data)
                                        if(err){
                                            console.log(err)
                                        } else {
                                            res.redirect('/login')
                                        }
                                    }); 
                                     }));
                         }
                })
              }
}) ;



//==========================================
// forget password end
//=========================================


app.get('/withdraw', ensureAuthenticated, (req, res)=>{

const total = req.user.totalAmount
console.log(total);

if (total < 1000){
    req.flash('error_msg' , 'You cannot withdraw this amount, Please fund your account');

    res.redirect('/myinvestment');
}else{
    res.render('withdrawal') 

}

    


})




    app.post('/withdraw',ensureAuthenticated, (req,res)=>{
        
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
const isInvest = req.user.isInvested
console.log(isInvest);


if (isInvest === false){
    res.render('investnow')

} else {
    req.flash('error_msg' , 'YOU HAVE AN ACTIVE INVESTMENT ALREADY');


    res.redirect('/myinvestment');
}




 })









app.post('/investnow1', ensureAuthenticated, (req, res)=>{

    const invest = [
        {name: "Jasper", amount: 5000, returns:"55%", period: "30 days"},
    ]


    const email = req.user.email;
    console.log(email)
    const totalamount = req.user.totalAmount
    console.log(totalamount)
    const invset = 5000;
    const isinvest = req.user.isInvested;
    // console.log(isinvest)
    const idd = req.user.id;


    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');

        res.redirect('/myinvestment')

    }
    
    else{
        // const invest1[
        //         {}
        // ]
        User.findByIdAndUpdate(idd, {totalAmount : (totalamount - invset ), isInvested : true}, (err, possible)=>{
            req.flash('success_msg','You have successfully bought an investment plan!');

            res.redirect('/myinvestment');

        }
        )
        //  res.send('possible');
    }


 })


 app.post('/investnow2', ensureAuthenticated, (req, res)=>{
    const email = req.user.email;
    console.log(email)
    const totalamount = req.user.totalAmount
    console.log(totalamount)
    const invset = 10000;
    const isinvest = req.user.isInvested;
    const idd = req.user.id;




    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');

        res.redirect('/myinvestment')
    } else{
        User.findByIdAndUpdate(idd, {totalAmount : (totalamount - invset ), isInvested : true}, (err, possible)=>{
            req.flash('success_msg','You have successfully bought an investment plan!');

            res.redirect('/myinvestment');

        })
    }
 })


 app.post('/investnow3', ensureAuthenticated, (req, res)=>{
    const email = req.user.email;
    console.log(email)
    const totalamount = req.user.totalAmount
    console.log(totalamount)
    const invset = 20000;
    const isinvest = req.user.isInvested;
    const idd = req.user.id;




    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');

        res.redirect('/myinvestment')

    } else{
        User.findByIdAndUpdate(idd, {totalAmount : (totalamount - invset ), isInvested : true}, (err, possible)=>{
            req.flash('success_msg','You have successfully bought an investment plan!');

            res.redirect('/myinvestment');
        })
        //  res.send('possible');
    }


 })


 app.post('/investnow4', ensureAuthenticated, (req, res)=>{
    const email = req.user.email;
    console.log(email)
    const totalamount = req.user.totalAmount
    console.log(totalamount)
    const invset = 50000;
    const isinvest = req.user.isInvested;
    const idd = req.user.id;



    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');

        res.redirect('/myinvestment')

    } else{
        User.findByIdAndUpdate(idd, {totalAmount : (totalamount - invset ), isInvested : true}, (err, possible)=>{
            req.flash('success_msg','You have successfully bought an investment plan!');

            res.redirect('/myinvestment');
        })
        //  res.send('possible');
    }



 });


 app.post('/investnow5', ensureAuthenticated, (req, res)=>{
    const email = req.user.email;
    console.log(email)
    const totalamount = req.user.totalAmount
    console.log(totalamount)
    const invset = 70000;
    const isinvest = req.user.isInvested;
    const idd = req.user.id;




    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');

        res.redirect('/myinvestment')

    } else{
        User.findByIdAndUpdate(idd, {totalAmount : (totalamount - invset), isInvested : true}, (err, possible)=>{
            req.flash('success_msg','You have successfully bought an investment plan!');

            res.redirect('/myinvestment');
        })
    }


 })


 app.post('/investnow6', ensureAuthenticated, (req, res)=>{
    const email = req.user.email;
    console.log(email)
    const totalamount = req.user.totalAmount
    console.log(totalamount)
    const invset = 100000;
    const isinvest = req.user.isInvested;
    const idd = req.user.id;
    // console.log(idd)



    if (totalamount < invset){
        req.flash('error_msg' , 'You current amount is too low for this package!!!!, Please fund your account');

        res.redirect('/myinvestment')

    } else{
        User.findByIdAndUpdate(idd, {totalAmount : (totalamount - invset ), isInvested : true}, (err, possible)=>{
            req.flash('success_msg','You have successfully bought an investment plan!');

            res.redirect('/myinvestment');
            
        })
    }



    
 });


    //==============================================================================================
    //==============================================================================================
    //=====================================================================================


app.get('/myinvestment', ensureAuthenticated, (req, res)=>{
   const recieve = req.user.recievedAmount;
    console.log(recieve);

    const amount = req.user.totalAmount;

    const total = req.user.totalAmount;

    const allcash = recieve + amount;
    
    const idd = req.user.id;
    console.log(idd);

    User.findByIdAndUpdate(idd, {totalAmount: allcash}, (err, money)=>{
        if(err){
            console.log(err)
        }

    })

User.findByIdAndUpdate(idd, {recievedAmount : 0}, function(err, data){
       
 })

 res.render('myinvest')
});

app.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/'); 
    })

app.listen(PORT, ()=> {
    console.log("Flamingo is now running");
});
