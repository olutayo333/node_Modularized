const mongoose = require("mongoose")

const express = require("express");
const app = express();

require("dotenv").config()

let userRouter = require("./routes/user.route")

const cors = require("cors")

//middleware
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use("/user", userRouter) 

let URI ="mongodb+srv://olutayostephen:AYANRINDE@cluster0.iibdlfl.mongodb.net/front-end-connect-db1?retryWrites=true&w=majority"
    mongoose.connect(URI) //UNIFORM RESOURCE IDENTIFIER (URI)
     .then(()=>{console.log("mongo has connect")})
     .catch((err)=>{console.log("mongo refuse" + err)})


//variable declaration
let PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("app is listening at PORT : " + PORT)
})

