const express = require("express");
const app = express();
const path = require("path");
const products = require("./db/products.json");
const bodyParser = require("body-parser");

// 1. npm i ejs
// 2. app.set
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// 3. change html to ejs
// 4. change res.send to res.render

////////////////////////////// Middlewares //////////////////////////////

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

////////////////////////////// Routers //////////////////////////////

// show all cards in the home page
app.get("/home", function (req, res) {
  res.locals.title = "Home";
  res.render("home", { list: products });
});

// show selected card
app.get("/profile/:uid", function (req, res) {
  res.locals.title = "Profile";
  // uid of products start from 1
  res.render("profile", { profile: products[req.params.uid - 1] });
});

// give value of searchbox and navigate result to another page
app.post("/submit", (req, res) => {
  res.locals.title = "Search";

  // search function
  const result = products.filter((obj) => obj.name.includes(req.body.value));
  //lowercase??
  res.render("search", { result });
});

app.listen(4997);
