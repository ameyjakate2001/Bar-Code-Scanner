const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express() ;
const port = process.env.PORT || 5000;

  const db = require('./config/keys').MongoURI;
  mongoose
    .connect(db, { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));

    require('./config/passport')(passport);

app.use(expressLayouts)
app.set('view engine', "ejs");
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static("public"));

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middlewares
 app.use(passport.initialize());
 app.use(passport.session());


//connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg')
   res.locals.err_msg = req.flash("err_msg");
   res.locals.error = req.flash("error");
   next();
})



app.use('/', require('./routes'))
app.use('/users', require('./routes/users'))
app.use("/", require("./routes/scan"));

app.listen(port, () => {
    console.log('server at 5000')
})