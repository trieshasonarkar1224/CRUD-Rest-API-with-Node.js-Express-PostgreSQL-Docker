// For routes related to our contacts

// Import statements
const express = require("express");
const router = express.Router();
const {
    getContacts, getContact, createContact, updateContact, deleteContact
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken); // To make all routes use validateTokenHandler middleware

// Retrieve all and post
router.route('/').get(getContacts).post(createContact);

// Retrieve by ID, update by ID, delete by ID
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);

// Export router so we can use it in server.js
module.exports = router;