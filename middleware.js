
const isLoggedIn = (req, res, next) => {
    console.log("user is " + req.user);//here we can see the user object from what passport is auth. 

    if (!req.isAuthenticated()) {
        req.flash("error", "You must have logged in first");
        return res.redirect("/login");
    }
    next();//if logged in call next middleware or route to continue
}
module.exports = { isLoggedIn };//we can export multiple middleware here