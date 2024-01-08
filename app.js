const express = require('express');
//const session = require('express-session')
const path = require('path')
const hbs = require('express-handlebars');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
mongoose.connect(process.env.MONGOOSE_URL)
    .then(() => console.log("DB connection Successful"))
    .catch((err) => console.log("DB not connected \n" + err));
PORT = 3000;

const app = express();
const db = require("./config/connection")
const authRouter = require("./routes/auth")
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }))

// app.use(
//     session({
//         secret: 'your-secret-key',
//         resave: false,
//         saveUninitialized: true,
//     })
// );

// app.use((req, res, next) => {
//     res.header('Cache-Control', 'no-store');
//     next();
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// db.connect()
//     .then(() => console.log("DB connection Successful"))
//     .catch((err) => console.log("DB not connected \n"+err));

app.use('/auth', authRouter)
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app;