// For User model

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: [true, "Please provide a username."]
        },
        email: {
            type: String,
            required: [true, "Please provide a user email address."],
            unique: [true, "Email address is already in use."]
        },
        password: {
            type: String,
            required: [true, "Please provide a user password."]
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);