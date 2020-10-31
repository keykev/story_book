const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session)

const connectDB = require('./config/db.js');

//load config
dotenv.config({path: './config/config.env'})

//connect db
connectDB()

//load passport config
require('./config/passport.js')(passport)


const app = express()

//body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json())

//Method override middleware
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//handlebars helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs.js')


// middleware handlebars
app.engine('.hbs', exphbs({
  helpers: {
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select,
  },
  defaulyLayout: 'main',
  extname: '.hbs'}));
app.set('view engine', '.hbs');

//express middleware
app.use(session({
    secret: 'keyboard_sad',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global var
app.use(function (req,res,next) {
  res.locals.user = req.user
  next()
})

//join static folder
app.use(express.static(path.join(__dirname,'public')))

//routes
app.use('/',require('./routes/index.js'))
app.use('/auth',require('./routes/auth.js'))
app.use('/stories',require('./routes/stories.js'))


const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}...`))  
 


