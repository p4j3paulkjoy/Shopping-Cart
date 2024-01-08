const router = require('express').Router();
const authHelpers = require('../helpers/authHelpers')
const CryptoJS = require("crypto-js");
const User = require("../models/user")
const jwt = require("jsonwebtoken");

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})


//Register
router.post('/signup', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_PASSPHRASE
        ).toString(),
    })

    try {
        const savedUser = await newUser.save();
        //console.log(savedUser)
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }

})

router.get('/login',(req,res)=>{
    res.render('auth/login')
})



//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );

        //console.log(user)


        !user && res.status(401).json("Wrong User Name");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_PASSPHRASE
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;

        originalPassword != inputPassword &&
            res.status(401).json("Wrong Password");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3d" }
        );



        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (err) {
        res.status(500).json(err);
    }

});

module.exports = router