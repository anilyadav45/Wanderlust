require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";//LOCAL CONNECTION 
//CLOUD CONNECTION
const dbUrl = process.env.MONGODB_ATLAS_URL;
app.engine('ejs', engine);
//importing routes
const listingRouter = require("./routes/listingRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");
const userRouter = require("./routes/userRouter.js");
//sesssion require
const MongoStore = require('connect-mongo');
const session = require('express-session');
const connectFlash = require('connect-flash');
//for user authentication -- use after session
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');

//for connect mongo 
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600 // time period in seconds
});

store.on('error', () => {
  console.log("error in mongo session " + err);
})

const sessionOptions = {//it help eg after login we can access the different tabs without login again and again so it used in passport also 
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expiryDate: new Date() + 60 * 1000 * 30, //30 minutes
    maxAge: 1000 * 60 * 30, //30 minutes
    httpOnly: true
  }
}



//using session middleware
app.use(session(sessionOptions));
//always use flash after session 
app.use(connectFlash());//flash middleware creating local variables for flash messages
//using pasasport and passport local for auth and always after session so that page to page auth provided
app.use(passport.initialize());
app.use(passport.session());
//configure passport to use local strategy
passport.use(new localStrategy(User.authenticate()));//this line create new localstrategy and authenticate for each User and .authenticate generate a func that is used is PLStrategy
passport.serializeUser(User.serializeUser());//serialize mean store user so that user is longer in process page to page 
passport.deserializeUser(User.deserializeUser()); // deserialze no longer info stored so can't get sign in 

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.deleted = req.flash("deleted");
  res.locals.currentUser = req.user; // passport store the user in req.user so we can access it in all ejs files like we used if else to show btns or not acording to ownership of listing
  next();
});





main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });




//here we use the routes we imported 
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);//like wise we make many indivisual routes like listings and reviews where related routes are grouped together and we can use them in app.js
//we use common part of the route here after that all present in indivisual routes
app.use("/", userRouter);//deined so that all routes we create we start form here like /signup , /login etc.


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});


//now we can see  how good the code is organized and how we can use indivisual routes in app.js using express.Router() and how we can use middleware to validate the data before saving it to the database. previous code while holding all routes it was around 200-300 LOC now only 50 so it is very easy to read and maintain the code.here we can add more routes like users, bookings etc. and we can use them in app.js like we did for listings and reviews.