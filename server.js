const express = require('express')
const app = express()
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const indexRouter = require('./routes/userRouter')
const authorRouter = require('./routes/authorRouter')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000

const initializePassport = require('./passportConfig');
initializePassport(passport);

//Middlewares
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(methodOverride('_method'))
app.use(
    session({
        secret: 'secretkey',
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())
app.use(passport.session())


//All routes here
app.use(indexRouter);
app.use(authorRouter);

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`))