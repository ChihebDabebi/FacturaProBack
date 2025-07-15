const express = require("express");
const http = require("http");
const path = require("path");

const mongoose = require("mongoose");
const configDb = require("./config/db.json");

const bookRouter = require('./routers/book');
// ceci est un exemple :
const contactRouter = require('./routers/contact');

const {searchAvailableBooks} = require('./services/book');


const app = express();
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/book', bookRouter);
// ceci est un exemple :
app.use('/contact', contactRouter);

mongoose.connect(configDb.mongo.uri);

const io = require('socket.io')(server);
io.on("connection", (socket)=>{
    console.log("a user is connected");

    socket.on("clickedBtn", async (data) => {
        const books = await searchAvailableBooks();
        io.emit("search", books.length);
    });

});

server.listen(3000, ()=>{
    console.log('server is running on http://localhost:3000');
});
