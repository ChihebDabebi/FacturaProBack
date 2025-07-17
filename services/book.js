const {Book} = require('../models/invoice');

const searchAvailableBooks = async () => {
    const books = await Book.find({available:true});
    return books;
}

module.exports = { searchAvailableBooks };