const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = 'Authorization';
const JWT_SECRET = 'super_secret_key';

app.use((req, res, next) => {
    const token = req.get(SESSION_KEY);

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.session = decoded;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    next();
});

app.get('/', (req, res) => {
    if (req.session) {
        return res.json({
            username: req.session.username,
            logout: 'http://localhost:3000/logout'
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/logout', (req, res) => {
    sessions.destroy(req, res);
    res.redirect('/');
});

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
]

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find(user => user.login === login && user.password === password);

    if (user) {
        const tokenData = {
            username: user.username,
            login: user.login
        };

        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } else {
        res.status(401).send();
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
