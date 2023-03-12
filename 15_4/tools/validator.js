let users = require("../db/users-data.json");
let errorMessages = [];

// reset the error messages
const resetMessages = function () {
  return (req, res, next) => {
    errorMessages = [];
    next();
  };
};

////////////////////////////// sanitization //////////////////////////////
const sanitization = () => {
  return (req, res, next) => {
    // check null object
    if (Object.keys(req.body).length === 0) {
      errorMessages.push("Not acceptable, null object recieved.");
    }

    // sanitization
    const pattern = ["email", "username", "password", "gender"];

    // check the right length of object
    if (pattern.length !== Object.keys(req.body).length) {
      errorMessages.push("Not acceptable, properties are not match.");
    }

    // check to right properties
    for (const key in req.body) {
      if (!pattern.includes(key))
        errorMessages.push(`Not acceptable, invalid input (${key})`);
    }
    next();
  };
};

// check being empty
const isEmpty = (field) => {
  return (req, res, next) => {
    if (!req.body[field]) {
      errorMessages.push(`${field} IsEmpty`);
    }
    next();
  };
};

////////////////////////////// validatin of email //////////////////////////////

const validEmail = function () {
  return (req, res, next) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (req.body.email && !pattern.test(req.body.email)) {
      errorMessages.push("Email is not proper.");
    }
    next();
  };
};

// check the validatin of password
const validPassword = function () {
  return (req, res, next) => {
    const pattern =
      /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)(?=[^!#%]*[!#%])[A-Za-z0-9!#%]{8,32}$/;
    if (req.body.password && !pattern.test(req.body.password)) {
      errorMessages.push("Password is not proper.");
    }
    next();
  };
};

////////////////////////////// validatin of password //////////////////////////////

const validUsername = function () {
  return (req, res, next) => {
    // pattern
    const pattern = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/;
    if (req.body.username && !pattern.test(req.body.username)) {
      errorMessages.push("Username is not proper.");
    }

    // check duplication
    const duplicateUsername = users.find(
      (x) => x.username === req.body.username
    );
    if (!!duplicateUsername) errorMessages.push("Username is already taken.");

    console.log(errorMessages);
    next();
  };
};

module.exports = {
  errorMessages,
  resetMessages,
  sanitization,
  isEmpty,
  validEmail,
  validPassword,
  validUsername,
};
