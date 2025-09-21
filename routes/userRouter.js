const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require('passport');
const { saveReqUrl } = require("../middleware.js");//before pasport we use it to save requested url in session to locals after login ps reset session -- tahi par ete kare parihai

//sign up routes
router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;//destructuring name should be same as in form
        const newUser = new User({ username, email });//creating new user instance password not passed here as it will be hashed by passport local mongoose
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);//jaise hi user registered ho jata hai usse login karwa do using pasport login method use karke
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");//if error like user already exist redirect to signup page
    }
}))


//login routes
router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
})

router.post("/login", saveReqUrl,
    passport.authenticate( //see docs for passport--this is middleware between route and callback
        "local", { failureRedirect: '/login', failureFlash: true }
    ),
    //this only execute if papport middleware authenticated 
    wrapAsync(async (req, res) => {
        req.flash("success", "Login succesfully");
        //after login redirect to user requested url which use saved in session 
        const redirectUrl = res.locals.reqUrl;
        res.redirect(redirectUrl);
    })

)

// log out route : passport auto logout the user this is inbuild method 
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out succesfully");
        res.redirect("/listings");
    })
})

module.exports = router;