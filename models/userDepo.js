const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const userDepoSchema  = new mongoose.Schema({
    status :{
        type  : String,
        required : true,
        default :"pending"
    } ,


    amount :{
        type  : String,
        required : true
        
    } ,

  
  payment_method :{
    type  : String,
    required : true
} ,
   
date :{
        type : Date,
        default : new Date()
    },

user: [ 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
});




const Deposit= mongoose.model('Deposit', DepositSchema);

module.exports = Deposit;