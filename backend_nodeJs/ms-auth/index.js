const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios')
const fs = require('fs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Set up Global configuration access
dotenv.config();

let PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});

// Generate Token
app.post("/", async (req, res) => {
    axios.get(process.env.URL_MS_USER_GET, { login: req.body.login, password: req.body.password }).then(resp => {
        if (resp.data) {
            // Then generate JWT Token
            let jwtSecretKey = fs.readFileSync("private.key").toString();
            let data = {
                time: Date(),
                ...resp.data
            }

            const options = {
                expiresIn: process.env.JWT_EXPIRY,
                algorithm: 'RS256'
            }

            const token = jwt.sign(data, jwtSecretKey, options);
            res.send(token);
        } else {
            return res.status(401).send("Invalid credentials.");
        }
    }).catch(err => {
        console.log(err)
        return res.status(401).send("Invalid credentials.");
    })
});

// Verify Token
app.get("/", (req, res) => {
    let jwtSecretKey = fs.readFileSync("public.key").toString();
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});