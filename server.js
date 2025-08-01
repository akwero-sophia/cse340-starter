/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts"); 
const app = express();
const inventoryRoute = require("./routes/inventoryRoute"); 
const utilities = require("./utilities/");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const messages = require("express-messages");


// Middleware 
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

// Flash Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res);
  next();
});

 
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
// Populate Navigation for All Responses
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    next(err);
  }
});

// Serve Static Files
app.use(express.static("public"));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use("/inv", inventoryRoute);

// Test Route
app.get("/account/test", (req, res) => {
  res.send("Account test route is working");
});

 
/* ***********************
 * Express Error Handler
 *************************/
app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "An unknown error occurred.",
    nav: res.locals.nav,
  });
});

/* ***********************
 * Server Configuration
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
});