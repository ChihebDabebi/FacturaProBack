const mongoose = require("mongoose");

const book = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    price: Number,
    available: Boolean,
});

const Book = mongoose.model("books", book);

module.exports = {Book};
