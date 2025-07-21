const express = require("express");
const http = require("http");
const path = require("path");
const cors = require('cors');
require('dotenv').config();
const mongoose = require("mongoose");
const configDb = require("./config/db.json");

const userRouter = require('./routers/userRouter');
// ceci est un exemple :
const invoiceRouter = require('./routers/invoiceRouter');
const authRouter = require('./routers/authRouter');

const {searchAvailableBooks} = require('./services/book');


const app = express();
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
require('./models/user');
require('./models/invoice');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/user', userRouter);
app.use('/auth', authRouter);

// ceci est un exemple :
app.use('/invoice', invoiceRouter);

mongoose.connect(configDb.mongo.uri);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const io = require('socket.io')(server);
io.on("connection", (socket)=>{
    console.log("a user is connected");

    socket.on("clickedBtn", async (data) => {
        const books = await searchAvailableBooks();
        io.emit("search", books.length);
    });

});

server.listen(3001, ()=>{
    console.log('server is running on http://localhost:3001');
});
 