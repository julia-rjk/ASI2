const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Set up Global configuration access
dotenv.config();

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});

// Main Code Here  //
// Generating JWT
app.post("/user/generateToken", (req, res) => {
    // Validate User Here
    console.log(req.body)
    if (req.body.username=="" && req.body.password=="") {
        // Then generate JWT Token
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            usernmae: req.body.username
        }

        const options = {
            expiresIn: process.env.JWT_EXPIRY,
            algorithm: 'HS256'
          }

        const token = jwt.sign(data, jwtSecretKey, options);
        res.send(token);
    } else {
        return res.status(401).send("Invalid credentials.");
    }
});

// Verification of JWT
app.get("/user/validateToken", (req, res) => {
    // Tokens are generally passed in header of request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);
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