require('dotenv').config();
var express = require('express');

var app = express();
const path = require('path')
const { OAuth2Client } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const CLIENT_ID = '881936870792-b6ffk3acq9rrbv5dk0ocdb4nqt0ag8kk.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const mongoose = require('mongoose');
const User = require('./models/User');




const apiurl = 'https://insiit-backend-node.vercel.app'; //production url

// const apiurl = 'http://localhost:3000'; //for internal development testing

// const MONGODB_URI = 'mongodb://localhost:27017/insiit';
const MONGODB_URI = process.env.MongoDBAtlas

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", __dirname + "/views");
app.set('view engine', 'ejs');



app.get('/mess', checkAuthenticated, function (req, res) {
    res.render('mess', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture });
});

app.get('/outlets', checkAuthenticated, function (req, res) {
    res.render('outlets', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture });
});

app.get('/buses', checkAuthenticated, function (req, res) {
    res.render('buses', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture });
});

app.get('/edit-menu', checkAuthenticated, function (req, res) {
    res.render('edit-menu', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture });
});

app.get('/events', checkAuthenticated, function (req, res) {
    res.render('events', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/representatives', checkSecy, function (req, res) {
    res.render('representatives', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture });
});

app.get('/about', checkAuthenticated, function (req, res) {
    res.render('about', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture });
});

app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login');
})

app.get('/manage_admin', checkAdmin, function (req, res) {
    res.render('manage_admin', { apiurl: apiurl, email: req.user.email, name: req.user.name, picture: req.user.picture});
});



app.get("/", checkAuthenticated, function (req, res) {

    if (req.user) {
        console.log(req.user);

        res.render("index", { loggedIn: true, email: req.user.email, name: req.user.name, picture: req.user.picture});
    } else {

        res.render('/login');
    }

});

// function checkAuthenticated(req, res, next) {

//     let token = req.cookies['session-token'];

//     let user = {};
//     async function verify() {
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: CLIENT_ID,
//         });
//         const payload = ticket.getPayload();
//         user.name = payload.name;
//         user.email = payload.email;
//         user.picture = payload.picture;
//     }
//     verify()
//         .then(() => {
//             req.user = user;
//             next();
//         })
//         .catch(err => {
//             res.redirect('/login')
//         })

// }


function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token'];
    let user = {};

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;

        try {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                throw new Error('User not found');
            }
        } catch (err) {
            throw new Error('User not found');
        }
    }

    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login');
        });
}



function checkAdmin(req, res, next) {
    let token = req.cookies['session-token'];
    let user = {};

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;

        try {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                throw new Error('User not found');
            }

            if (existingUser.userType !== 'admin') {
                res.status(403).send('<h1>Only InsIIT Maintainers can access this Page!</h1> <br> <a href="/">Go back to Homepage</a>');
            }
        } catch (err) {
            throw new Error('User not found');
        }
    }

    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login');
        });
}


function checkSecy(req, res, next) {
    let token = req.cookies['session-token'];
    let user = {};

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;

        try {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                throw new Error('User not found');
            }

            if (existingUser.email !== 'kumaranmol@iitgn.ac.in' && existingUser.email !== 'general.secretary@iitgn.ac.in' && existingUser.email !== 'convener.ss@iitgn.ac.in') {
                res.send('<h1>Only Convener & Gsecy can access this Page!</h1> <br> <a href="/">Go back to Homepage</a>');
            }
        } catch (err) {
            throw new Error('User not found');
        }
    }

    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login');
        });
}


app.post("/", (req, res) => {
    let token = req.body.credential;
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
    }
    verify().then(() => {
        res.cookie('session-token', token);
        res.redirect('/');
    }).catch(console.error);
});

app.listen(8080);
console.log('Server is listening on port 8080');