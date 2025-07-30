const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;

    let authHeader = req.headers.Authorization || req.headers.authorization; // Recall: There are two ways we can pass authorization token: in header or bearer
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(' ')[1]; // Get the token

        // Verify the token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error("User is not authorized (token issue).");
            } 
            req.user = decoded.user; // Extract only the user info from "decoded"
            next(); // Middleware to intercept the request
        });

        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing from request.");
        }
    }
});

module.exports = validateToken;