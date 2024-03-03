
let userModel= require("../models/user.model");
let jwt = require("jsonwebtoken")
let nodemailer = require("nodemailer")     
const displayWelcome=(req,res  )=>{
    res.send("welcome user")
}

const registerUser = (req,res)=>{
    console.log(req.body)
    let userData = { 
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email:req.body.email,
            password:req.body.password
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
                let token = jwt.sign({email}, secret, {expiresIn:300})//60, "1h", "1d"
                console.log(token)
                res.send({status:true, message:"successful! welcome", token})}
         })
         console.log("hurray user exist")
        }
})
.catch((err)=>{console.log(err)})
}
//AUTORIZATION FOR THE DASHBOARD
const getDashboard = (req,res)=>{
   // console.log("iz workign")
    let token = req.headers.authorization.split(" ")[1];
    let secret = process.env.SECRET
    jwt.verify(token, secret, (err,result)=>{
        if(err){console.log(err); res.send({status:false, message:"can't signin"})}
        else{res.send({status:true, message:"welcome", result}  ) ;console.log(result.email);}
    })
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
            let oldEmail = req.body.email 
            let {firstname,lastname,newemail,password}=req.body
            userModel.findOneAndUpdate( {email:oldEmail}, {firstname,lastname,newemail,password}, {new:true})
            //userModel.findByIdAndUpdate(id, req.body.id)
            .then((result)=>{res.send({status:true, message:"Edited successfully", result}) })
            .catch((err)=>{console.log(err+ "couldnt edit"); res.send({status:false, message:"could not Edit", result}) })
        }



module.exports = {displayWelcome, registerUser, signin, getDashboard, sendMail, displaydata, deleteUser, editUser }