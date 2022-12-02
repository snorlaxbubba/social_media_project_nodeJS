//Initialize Requirements

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const uri =
        "mongodb+srv://myamauchi:Charlie1@ssd-0.457s283.mongodb.net/social-media-project?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once("open", function () {
    console.log("Connected to Mongo");
});

db.on("error", console.error.bind(console, "MongoDB connection error:" ));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use (
    require("express-session")({
        secret: "Hello World",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(cookieParser());

// // Parse cookies and attach them to the request object
// app.use(cookieParser());

// // Initialize passport and configure for User model
// app.use(passport.initialize());
// app.use(passport.session());
// const User = require("./models/User");
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Set up EJS templating
// app.set("view engine", "ejs");
// // Enable layouts
// app.use(expressLayouts);
// // Set the default layout
// app.set("layout", "./layouts/main-layout");

// // Make views folder globally accessible
// app.set("views", path.join(__dirname, "views"));

// // Make the public folder accessible for serving static files
// app.use(express.static("public"));

// Index routes
const indexRouter = require("./routers/indexRouter");
app.use(indexRouter);

// // User routes
// const userRouter = require("./routers/userRouter");
// app.use("/user", userRouter);

// // Secure routes
// const secureRouter = require("./routers/secureRouter");
// app.use("/secure", secureRouter);

// Start listening
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Auth Demo listening on port ${port}!`));