const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));  ;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    let bookInfo = null;

    for (let key in books) {
        if (books[key].isbn === ISBN) {
            bookInfo = books[key];
            break;
        }
    }

    if (bookInfo) {
        return res.send("The book details for ISBN number: " + ISBN + ", are: " + JSON.stringify(bookInfo));
    } else {
        return res.status(404).send("No books found for the ISBN: " + ISBN);
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase(); // Convert to lowercase for case-insensitive comparison
    let booksByAuthor = [];

    for (let key in books) {
        if (books[key].author.toLowerCase() === author) {
            booksByAuthor.push(books[key]);
        }
    }

    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    } else {
        return res.status(404).send("No books found for the author: " + req.params.author);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
 