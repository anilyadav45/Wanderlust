const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.engine('ejs', engine);
//importing routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


//here we use the routes we imported 
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);//like wise we make many indivisual routes like listings and reviews where related routes are grouped together and we can use them in app.js
//we use common part of the route here after that all present in indivisual routes


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});


//now we can see  how good the code is organized and how we can use indivisual routes in app.js using express.Router() and how we can use middleware to validate the data before saving it to the database. previous code while holding all routes it was around 200-300 LOC now only 50 so it is very easy to read and maintain the code.