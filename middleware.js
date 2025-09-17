
const isLoggedIn = (req, res, next) => {
    console.log("user is " + req.user);//where ever we use this middleware, we can access req.user

    if (!req.isAuthenticated()) {
        req.flash("error", "You must have logged in first");
        return res.redirect("/login");
    }
    next();//if logged in call next middleware or route to continue
}
module.exports = { isLoggedIn };//we can export multiple middleware here