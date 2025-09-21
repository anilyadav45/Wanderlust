
const isLoggedIn = (req, res, next) => {
    console.log("user is " + req.user);//here we can see the user object from what passport is auth. 
    //maniye koi user direct new , edit , delete route pe ja raha tha but wo login na hone ka karan usse login form mila so usne login kiya but wo /listings pe redirect ho gaya so that is not good UX for user mano koi important page pe ja raha tha wo waha pe hi redirect ho uske liye hum session me -- 1.user ki requested url req.path and req.originalUrl me store karwa denge so after login wo kaha jana chahta tha wo waha redirect wo sake naki ki same page jo hamne after login defualt set kiye he

    //start that - we can see mthods of req console.log(req.path+req.originalUrl);
    //we store redirect url in session so we don't check for every route if user is already logged in 

    if (!req.isAuthenticated()) {
        //inside if me -  isliye user kar rahe he qku hame pata he agar user login nahi huwa tabhi to user requested  url aakar save hoga then we'll use to redirect after login jaha use jana thaa
        req.session.reqUrl = req.originalUrl;//access it to user login
        console.log("requested url is " + req.session.reqUrl);
        req.flash("error", "You must have logged in first");
        return res.redirect("/login");//will redirect to login page whereever we're using it it will authenticate the user if not middleware will stop here and redirect to login page if authenticated call next that means continue to route
    }
    next();//if logged in call next middleware or route to continue
}


//middleware to save requested url in session to locals becauuse passport reset session after login so we need midW in between before login so that we get saved reqUlr which was stored in session before ps reset it afterlogin

const saveReqUrl = (req, res, next) => {
    if (req.session.reqUrl) {//sahi me user req hai session me tab nai save karbe otherwise no reason 
        res.locals.reqUrl = req.session.reqUrl;
    }
    next();
}

module.exports = { isLoggedIn, saveReqUrl };//we can export multiple middleware here
