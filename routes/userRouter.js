const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require('passport');
const { saveReqUrl } = require("../middleware.js");//before pasport we use it to save requested url in session to locals after login ps reset session -- tahi par ete kare parihai
const userController = require("../controllers/user.js");

//sign up routes
router.get("/signup", userController.getSignUp);

router.post("/signup", wrapAsync(userController.postSignUp));


//login routes
router.get("/login", userController.getLogin);

router.post("/login", saveReqUrl,
    passport.authenticate( //see docs for passport--this is middleware between route and callback
        "local", { failureRedirect: '/login', failureFlash: true }
    ),
    //this only execute if papport middleware authenticated 
    wrapAsync(userController.postLogin));

// log out route : passport auto logout the user this is inbuild method 
router.get("/logout", userController.logOut);

module.exports = router;