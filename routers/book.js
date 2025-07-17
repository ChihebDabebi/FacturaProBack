// ceci est un exemple :
const express =  require('express');
const router = express.Router();
const {Book} = require('../models/invoice');

router.get('/', async (req,res,next)=>{
    const books = await Book.find();
    res.json(books);
});

router.post('/', async (req, res, next)=>{
    const book = new Book({ 
        title: req.body.title, 
        author: req.body.author,
        genre: req.body.genre,
        price: req.body.price,
        available: true
    });
    await book.save();
    res.send("book has been created");
});

router.delete('/:id', async (req, res, next)=>{
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.send('book has been deleted');
});

router.put("/:id", async (req, res, next) => {
    const { id } = req.params;
    const newBook = await Book.findByIdAndUpdate(id, {
        title: req.body.title, 
        author: req.body.author,
        genre: req.body.genre,
        price: req.body.price,
    });
    res.json(newBook);
});

router.get('/filterByGenre/:genre', async (req,res,next)=>{
    const books = await Book.find({genre : req.params['genre']});
    res.json(books);
});

router.post('/buyWithDiscount/:id', async (req, res, next)=>{
    const foundBook = await Book.findById(req.params['id']);
    if(foundBook.available) {
        const discountedPrice = foundBook.price - (foundBook.price * (req.body['discountPercentage']/100));
        const newBook = await Book.findByIdAndUpdate(req.params['id'], {
            price: discountedPrice,
            available: false
        }, {new: true});
        res.json(newBook);
    } else {
        res.send("book is not available");
    }
});

router.get('/availableBooks', async (req,res,next)=>{
    res.render("book");
});

module.exports = router;