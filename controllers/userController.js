// For functions for user routes

const asyncHandler = require("express-async-handler"); // To use as error-handling middleware
const bcrypt = require("bcrypt"); // For hashing passwords
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Labels:
//@desc Register a user
//@route GET /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    // First, destructure
    const { username, email, password } = req.body;
    if (!username || !email || !password ) {
        res.status(400);
        throw new Error("All fields are mandatory.");
    }

    // Check whether email is available
    const userUnavailable = await User.findOne({ email });
    if(userUnavailable) {
        res.status(400);
        throw new Error("Email is already in use.");
    }

    // Create and store hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create the new user
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    
    console.log(`User created: ${user}`);
    if(user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid.");
    }
});

// Labels:
//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    // We need the user to get a token (JSON web token / JWT) each time they log in (https://jwt.io/)
    const { email, password } = req.body;
    if ( !email || !password ) {
        res.status(400);
        throw new Error("All fields are mandatory.");
    }

    // See if the user is available
    const user = await User.findOne({ email });

    // Compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        // If password is correct, provide a JWT
        const accessToken = jwt.sign(
        {
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    ); // For signing in (use/embed username, email, and id as payload; ACCESS_TOKEN_SECRET from .env, and expiration time)
        res.status(200).json({ accessToken });
    } else {
        response.status(401);
        throw new Error("Invalid email and/or password.");
    }

    res.json({ message: "Login user" });
});

// Labels:
//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
}