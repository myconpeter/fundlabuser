const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const PORT    = process.env.PORT || 8000;


app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));


app.set("view engine", "ejs");

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/tips', (req, res)=>{
    res.render('tips')
})


app.get("/login", (req, res)=>{
    res.render('login')
})



app.get('/contact', (req, res)=>{
    res.render('contact')
})

app.get('/vendor', (req, res)=>{
    res.render('vendor')
})

app.get('/about', (req, res)=>{
    res.render('about')
})

app.get('/signup', (req, res)=>{
res.render('signup')
})

app.get('/forgetpassword', (req, res)=>{
    res.render('forgetpassword')
})

app.get('/admin', (req, res)=>{
    res.render('adminlogin')
})

app.get('/adminpage', (req, res)=>{
    res.render('adminpage')
})

app.get('/withdraw', (req, res)=>{
    res.render('withdrawal')
})










app.listen(PORT, ()=> {
    console.log("Flamingo is now running");
});
