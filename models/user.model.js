const mongoose = require("mongoose") //connecting to mongodb
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
//import bcrypt from "bcryptjs/dist/bcrypt"; // for password hashing

let frontEndSchema= mongoose.Schema({
    firstname:{type: String, required:true},
    lastname:{type: String, required:true},
    email:{type: String, required:true, unique:true},
    password:{type:String, required:true },
    myfile1:{type:String, },
    myfile2:{type:String},
    registrationDate:{type:Date, default:Date.now()},
    randomnumber:{type:String, required:true}

}) 


//PASSWORD HASHING
let saltRound=10;
frontEndSchema.pre("save", function(next){
    console.log(this.password)
    // bcrypt.hash(password,saltRound,callback)
    bcryptjs.hash(this.password,saltRound,(err,hashedPassword)=>{
        console.log(hashedPassword)
       if(err){console.log("password could not hash" + err)}
       else{ 
        this.password = hashedPassword
        next()}  
    })     
})


// frontEndSchema.pre("findOneAndUpdate", function(next){
//     console.log(this.password)
//     // bcrypt.hash(password,saltRound,callback)
//     bcryptjs.hash(this.password,saltRound,(err,hashedPassword)=>{
//         console.log(hashedPassword)
//        if(err){console.log("password could not hash" + err)}
//        else{ 
//         this.password = hashedPassword
//         next()}  //findOneAndUpdate  
//     })     
// })


//findOneAndUpdate

//PASSWORD UNHASHING
frontEndSchema.methods.validatePassword = function(password,callback){
    bcrypt.compare(password, this.password, (err, same)=>{
        console.log(same);
        if(!err){
            callback(err,same)
        }
        else{next()}
    })
}

let frontEndModel = mongoose.model("frontendconnect1", frontEndSchema)
module.exports = frontEndModel
// module.exports = {frontEndModel, uploadModel}