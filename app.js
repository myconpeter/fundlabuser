const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const passport = require ('passport');
const session = require('express-session');
const flash = require("connect-flash");


const PORT  = process.env.PORT  || 8000;


//passport config:
require('./config/passport')

// require all the route file
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/Auth");
const investmentRoutes = require("./routes/investment");
const investPlansRoutes = require("./routes/investplans");
const investPlansbRoutes = require("./routes/investplansb");
const investPlanscRoutes = require("./routes/investplansc");
const withdrawalRoutes = require("./routes/withdraw");
const resetPasswordRoute = require("./routes/resetpassword");
const investedMatureRoute = require("./routes/investmature");




// mongodb connection
// mongoose.connect("mongodb+srv://flamingo:michealisaman@cluster0.hknyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,

//   useCreateIndex: true
//  });

// local connection
// mongoose.connect('mongodb://localhost/flamingo', {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
//   useFindAndModify: false,
//    useCreateIndex: true
//  })
//  .then(() => console.log('connected to db'))
// .catch((err)=> console.log(err)); 




mongoose.connect('mongodb+srv://flamingo:michealpeter@cluster0.pa829.mongodb.net/flamingo?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//EJS
app.set('view engine','ejs');

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

app.use(indexRoutes);
app.use(authRoutes);
app.use(investmentRoutes);
app.use(investPlansRoutes);
app.use(withdrawalRoutes);
app.use(resetPasswordRoute);
app.use(investedMatureRoute);
app.use(investPlansbRoutes);
app.use(investPlanscRoutes);





app.listen(PORT, ()=> {
    console.log("Flamingo is now running");
});
