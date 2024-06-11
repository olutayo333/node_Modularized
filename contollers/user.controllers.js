const bcryptjs = require("bcryptjs");

   //import {v2 as cloudinary} from 'cloudinary';
    const cloudinary = require("cloudinary")     
    cloudinary.config({ 
    cloud_name: 'di01u7dxt', 
    api_key: '312857669553195', 
    api_secret: 'gDnRYEmSQ6cZez4DP9ptoynjz6s' 
    });

const userModel = require("../models/user.model")
// const uploadModel = require("../models/user.model")
let jwt = require("jsonwebtoken")
let nodemailer = require("nodemailer");     
const bcrypt = require("bcryptjs/dist/bcrypt");

const displayWelcome=(req,res  )=>{res.send("welcome user")}

const registerUser = (req,res)=>{
    
    let userData = { 
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email:req.body.email,
            password:req.body.password,
            myfile:req.body.myfile,
            randomnumber:req.body.randomnumber
     }  

     let form = new userModel(userData)
     let userEmail = req.body.email   

        userModel.find({email:userEmail})
        .then ((result)=>{
            if(result.length>0){ res.send({status:false, message:"Email Already Exist, Please use another Email"}); console.log('user already exist')}
            else{
                form.save()
                .then(()=>{console.log("data saved succesfully ");res.send({status:true, message:"signup was successful"})})
                .catch((err)=>{console.log('Data could not be saved' + err); res.send({status:false, message:"signup not successful"})})                
            }
        })
        .catch((err)=>{console.log(err)})
        console.log(req.body)          
        }                                  

//AUTHENTICATION VERIFYING PASSWORD
const signin =(req,res)=>{
console.log(req.body)
let {email,password} = req.body

//userModel.findOne({email:req.body.email})
userModel.findOne({email:email})
.then((user)=>{
    console.log(user); 
    if(!user){res.send({status:false, message:"user not found"})}
    else{
        
        let secret = process.env.SECRET
         user.validatePassword(password, (err,same)=>{
            if(!same){res.send({status:false,message:"Password Incorrect"})}
            else{
                //AUTOURIZATION
                let token = jwt.sign({email}, secret, {expiresIn:900}); console.log(token);//60, "1h", "1d"
                
                //res.send({status:true, message:"successful! welcome", token})
                userModel.find()
                    .then((result)=>{res.send({user, token, message:"successful! Welcome", status:true, result})})
                    .catch((err)=>{console.log("could not fetch data" + err);})
            }
         })
         console.log("hurray user exist")
        }
})
.catch((err)=>{console.log(err)})
}

//NODE MAILLER
const sendMail = ()=>{
    //console.log("izz working")
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.USER_EMAIL ,
            pass: process.env.USER_PASS
            }
        });
        
        var mailOptions = {
            from: 'olutayostephen@gmail.com',
            to: 'stephent333@gmail.com, regisenterprise01@gmail.com',
            subject: ' SECOND Testing Node Mailer',
            html: '<h1> ELEKEJI RE RE OOO Hello Mr Stephen, Hope you are doing great? </h1>' 
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
}
        //reading 
        const displaydata = (req,res)=>{
            let token = req.headers.authorization.split(" ")[1];
            let secret = process.env.SECRET
            jwt.verify(token, secret, (err,result)=>{
                if(err){console.log(err); res.send({status:false, message:"not authourized"})}
                else{
                    userModel.find()
                    .then((result)=>{console.log(result); res.send({status:true, message:result, result})})
                    .catch((err)=>{console.log("could not fetch data" + err);})      
                    //res.send({status:true, message:"welcome", result}  ) 
                    }
            })
        }

        //AUTORIZATION FOR THE DASHBOARD
        const getDashboard = (req,res)=>{
        // console.log("iz workign")
        let token = req.headers.authorization.split(" ")[1];
        let secret = process.env.SECRET
        jwt.verify(token, secret, (err,result)=>{
         if(err){console.log(err); res.send({status:false, message:"can't signin"})}
         else{
                const id = _id
                userModel.find()
                .then((result)=>{console.log(result.email); res.send({status:true, message:result, result,}  )})
                .catch((err)=>{console.log("could not fetch data" + err); res.send({status:false})})
            }
         })
    }

        //delete user
        const deleteUser = (req, res)=>{
            console.log(req.body); let userEmail = req.body.email
            userModel.findOneAndDelete({email:userEmail})
            .then((result)=>{
                console.log(result); res.send({status:true, message:"Deleted successfully", result})
            })
            .catch((err)=>{console.log(err+ "couldnt delete"); res.send({status:false, message:"could not Delete", result})} )
            
        //let userIndex = req.body.index
        //userModel.deleteOne({_id: userIndex})
        //.then((result)=>{console.log("deleted successfully"); res.send({status:true, userIndex:userIndex, });})
        //.catch((err)=>{console.log("could not delete" + err)})
        }

        //edit user
        const editUser =(req, res)=>{ 
            let pass
            bcryptjs.hash(req.body.password,10,(err,hashedPassword)=>{
                //console.log(hashedPassword)
                if(err){res.send({status:false, message:"could not hash password", err}); console.log("password could not hash" + err)}
                else{ 
                    pass = hashedPassword;
                    
                    console.log(req.body); console.log("HASHED password is" + pass)
                    //let oldemail = req.body.oldemail    
                    let  firstname= req.body.firstname;
                    let  lastname = req.body.lastname;
                    let  newemail=req.body.newemail;
                    let password = pass; 
                    //let {firstname,lastname,newemail,password}=req.body
                  userModel.findOneAndUpdate( {email:newemail}, {firstname,lastname,newemail,password}, {new:true} )
                  //userModel.findByIdAndUpdate(id, req.body.id)
                  .then((result)=>{res.send({status:true, message:"Edited successfully", result}) })
                  .catch((err)=>{console.log(err+ "couldnt edit"); res.send({status:false, message:"could not Edit", err}) })
                }  
                
            
            })
            
        }

        //Api_test
        const api = (req,res) =>{
            res.send({status:true, message: 
                [{name:"stephen", age:"02"}, {name:"stephen", age:"02"},]
            })
            console.log([{name:"stephen", age:"02"}, {name:"stephen", age:"02"},])
        }

        //CLOUDINARY
        const uploadFiles = (req,res)=>{
            // let savefile = new uploadModel(req.body.myfile)
           //result.secure_url
            let myfile = req.body.myfile
            cloudinary.v2.uploader.upload(myfile, (err, result)=>{
                if (err){console.log("failed");}
                else{console.log(result); res.send({status:true, message:"successful", result})}
            });

            // savefile.save()
            //     .then(()=>{console.log("file uploaded succesfully");res.send({status:true, message:"upload successful"})})
            //     .catch((err)=>{console.log('upload failed' + err); res.send({status:false, message:"upload failed"})})                
        } 

module.exports = {displayWelcome, registerUser, signin, getDashboard, sendMail, displaydata, deleteUser, editUser,api, uploadFiles }