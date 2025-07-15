// ceci est un exemple :
const mongoose = require("mongoose");
const yup = require('yup');

const contact = new mongoose.Schema({
    name: String,
    phone: String,
});

const Contact = mongoose.model("contacts", contact);

const contactSchema = yup.object({
    body: yup.object({
        contactName: yup.string().min(2).max(5).required(),
        contactPhone: yup.string().required()
    })
});

module.exports = {Contact, contactSchema};
