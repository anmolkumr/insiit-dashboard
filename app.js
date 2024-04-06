var express = require('express');
var app = express();
const path = require('path')
const { OAuth2Client } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const CLIENT_ID = '881936870792-b6ffk3acq9rrbv5dk0ocdb4nqt0ag8kk.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);



const apiurl = 'https://insiit-backend-node.vercel.app'; //production url

// const apiurl = 'http://localhost:3000'; //for internal development testing

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');


app.get('/mess', checkAuthenticated, function (req, res) {
    res.render('mess', { apiurl });
});

app.get('/outlets', checkAuthenticated, function (req, res) {
    res.render('outlets', { apiurl });
});

app.get('/buses', checkAuthenticated, function (req, res) {
    res.render('buses', { apiurl });
});

app.get('/edit-menu', checkAuthenticated, function (req, res) {
    res.render('edit-menu', { apiurl });
});

app.get('/events', checkAuthenticated, function (req, res) {
    res.render('events', { apiurl });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/representatives', checkAuthenticated, function (req, res) {
    res.render('representatives', { apiurl });
});

app.get('/about', checkAuthenticated, function (req, res) {
    res.render('about', { apiurl });
});

app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login');
})




app.get("/", checkAuthenticated, function (req, res) {
    if (req.user) {
        console.log(req.user);

        res.render("index", { loggedIn: true, email: req.user.email, name: req.user.name });
    } else {

        res.render('/login');
    }

});

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
    }
    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login')
        })

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