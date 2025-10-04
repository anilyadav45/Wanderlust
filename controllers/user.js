const User = require("../models/user");

//get signup
module.exports.getSignUp = (req, res) => {
    res.render("./users/signup.ejs");
};

//post signup
module.exports.postSignUp = async (req, res) => {
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
};

//get login
module.exports.getLogin = (req, res) => {
    res.render("./users/login.ejs");
};

//post login
module.exports.postLogin = async (req, res) => {
    req.flash("success", "Login succesfully");
    //after login redirect to user requested url which use saved in session 
    const redirectUrl = res.locals.reqUrl;
    if (redirectUrl) {
        return res.redirect(redirectUrl);
    }
    res.redirect("/listings");
};

//logout
module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out succesfully");
        res.redirect("/listings");
    })
};