const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const PORT    = 8000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.get('/', (req, res)=>{
    res.render('loin')
})







app.listen(PORT, ()=> {
    console.log("Flamingo is now running");
});
