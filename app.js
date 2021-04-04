const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const PORT    = 8000;


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

app.get('/vendors', (req, res)=>{
    res.render('vendors')
})

app.get('/about', (req, res)=>{
    res.render('about')
})









app.listen(PORT, ()=> {
    console.log("Flamingo is now running");
});
