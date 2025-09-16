const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require('passport');

//sign up routes
router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;//destructuring name should be same as in form
        const newUser = new User({ username, email });//creating new user instance password not passed here as it will be hashed by passport local mongoose
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
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

router.post("/login",
    passport.authenticate( //see docs for passport
        "local", { failureRedirect: '/login', failureFlash: true }
    ),
    //this only execute if papport middleware authenticated 
    wrapAsync(async (req, res) => {
        req.flash("success", "Login succesfully");
        res.redirect("/listings");
    })

)

module.exports = router;