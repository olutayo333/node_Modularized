//List of Imports
const express = require("express");
const router = express.Router()

const {displayWelcome, registerUser, signin, getDashboard, sendMail, displaydata, deleteUser, editUser, api, uploadFiles} = require("../contollers/user.controllers")

//Routes
router.get("/welcome", displayWelcome )
router.post("/register", registerUser)
router.post("/signin", signin)
router.get("/dashboard", getDashboard )
router.get("/sendmail", sendMail)
router.get("/display", displaydata)
router.post("/delete", deleteUser)
router.post("/edit", editUser)
router.get('/api', api)
router.post('/upload', uploadFiles)

module.exports = router