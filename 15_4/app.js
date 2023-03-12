const express = require("express");
const app = express();
const {
  errorMessages,
  resetMessages,
  isEmpty,
  validEmail,
  validPassword,
  validUsername,
  sanitization,
} = require("./tools/validator");
const fs = require("fs");
const path = require("path");

let users = require("./db/users-data.json");

app.set("view engine", "ejs");

////////////////////////////// Middleware //////////////////////////////

// fetch body of reqs as req.body
app.use(express.json());

// encode info from url
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

////////////////////////////// Routes //////////////////////////////

// Route - request handler (cb)
app.get("/signup", function (req, res) {
  res.locals.title = "Signup";
  res.render("signup");
});

app.post(
  "/submit",
  //resetMessages(),
  sanitization(),
  isEmpty("email"),
  isEmpty("password"),
  isEmpty("username"),
  isEmpty("gender"),
  validEmail(),
  validPassword(),
  validUsername(),
  function (req, res) {
    console.log(errorMessages.length);
    if (errorMessages.length !== 0) {
      return res.status(406).send(errorMessages);
    }

    users.push(req.body);
    //recivedUsername = req.body.username

    try {
      fs.writeFileSync(
        path.join(__dirname, "./db/users-data.json"),
        JSON.stringify(users)
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).send("Can not be accomplished now");
    }

    return res.redirect(`profile/${req.body.username}`);
  }
);

app.get("/profile/:recivedUsername", function (req, res) {
  res.locals.title = "Profile";
  // recivedUsername =""??
  const targetUser = users.filter((obj) => obj.username.includes(req.params.recivedUsername));
    console.log(targetUser);
res.render("profile", {data: targetUser});
});

app.listen(8100, () => console.log("listen on 8100"));
