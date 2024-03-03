const mongoose = require("mongoose")

const express = require("express");
const app = express();

require("dotenv").config()
const cors = require("cors")

let userRouter = require("./routes/user.route")

//middleware
app.use(cors()); //Allow front-end app on different PORT to communicate with backend on another PORT. (cross origin resource sharing)
app.use(express.urlencoded({extended:true})) // For post request from front end
app.use(express.json()) // For POST request from front end.- Help to recieve JSON file from front end

app.use("/user", userRouter) 

//STARTING UP/ CONNECTING TO  THE DATA
    let URI ="mongodb+srv://olutayostephen:AYANRINDE@cluster0.iibdlfl.mongodb.net/front-end-connect-db1?retryWrites=true&w=majority"
    mongoose.connect(URI) //UNIFORM RESOURCE IDENTIFIER (URI)
     .then(()=>{console.log("mongo has connect")})
     .catch((err)=>{console.log("mongo refuse" + err)})

//variable declaration
let PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("app is listening at PORT : " + PORT)
})

// To DEPLOY to render
//Branch = master
//Root Directory = .
//runtime = Node
// Buid Command = npm install
// start commend = node index.js
//Add  Enivinroment Variables

