// const Admin = require("../models/admin");
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');
// // const passportx = require ('passport');




// module.exports = function(passportx){
//     passportx.use(
//         new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
//             //match admin
//             Admin.findOne({email:email})
//             .then((admin)=>{
//                 if(!admin){
//                     return done(null,false,{message:'email not registered'});
//                 }
//                 //math passwords
//                 bcrypt.compare(password,admin.password,(err,isMatch)=>{
//                     if(err) throw err;
//                     if(isMatch){
//                         return done(null,admin);
//                     } else{
//                         return done(null,false,{message: 'password incorrect'});
//                     }
//                 })
//             })
//             .catch((err)=>{console.log(err)})
//         })
//     )
//     passportx.serializeUser(function(admin, done) {
//         done(null,admin.id);
//     })
//     passportx.deserializeUser(function(id, done){
//         Admin.findById(id,function(err,admin){
//             done(err, admin);
//         })
//     })
// }