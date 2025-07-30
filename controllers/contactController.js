// This file will contain all of our logic and connections to our database

const asyncHandler = require("express-async-handler"); // To use as error-handling middleware
const Contact = require("../models/contactModel"); // So we can use our Contact model

// Labels:
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });

    // Return status and json object with message
    res.status(200).json(contacts);
});

// Labels:
//@desc Get a contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found.");
    } 

    // Return status and json object with message
    res.status(200).json(contact);
});

// Labels:
//@desc Update a contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found.");
    } 

    // Check that the contact was made by the user making the request
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to update other users' contacts.");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
    );

    // Return status and json object with message
    res.status(200).json(updatedContact);
});

// Labels:
//@desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log("req.body: ", req.body);

    // Destructure the request body
    const {name, email, phone} = req.body;
    // Check for null/missing values; throw error if so
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory.");
    }

    // If all value are provided, create a new contact
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    }); // We are using the values from the destructured req.body

    // Return status and json object with message (status code 201 since resource created)
    res.status(201).json(contact);
});

// Labels:
//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found.");
    } 
    
    // Check that the contact was made by the user making the request
    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to delete other users' contacts.");
    }

    await Contact.deleteOne({_id: req.params.id});

    // Return status and json object with message
    res.status(200).json(contact);
});

module.exports = { 
    getContacts, 
    getContact, 
    createContact, 
    updateContact, 
    deleteContact
};