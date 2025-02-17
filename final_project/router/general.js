const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// 1. Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    }).then((bookList) => {
        return res.send(JSON.stringify(bookList, null, 4));
    }).catch((err) => {
        return res.status(500).json({ message: "Internal Server Error" });
    });
});

// 2. Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    new Promise((resolve, reject) => {
        let bookByIsbn = null;
        for (let key in books) {
            if (books[key].isbn === ISBN) {
                bookByIsbn = books[key];
                break;
            }
        }
        if (bookByIsbn) {
            resolve(bookByIsbn);
        } else {
            reject("No books found for the ISBN: " + ISBN);
        }
    }).then((book) => {
        return res.send("The book details for ISBN number: " + ISBN + ", are: " + JSON.stringify(book));
    }).catch((err) => {
        return res.status(404).send(err);
    });
});

// 3. Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
        let booksByAuthor = [];
        for (let key in books) {
            if (books[key].author.toLowerCase() === author) {
                booksByAuthor.push(books[key]);
            }
        }
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("No books found for the author: " + req.params.author);
        }
    }).then((books) => {
        return res.send("This is/are the book(s) by this author: " + JSON.stringify(books));
    }).catch((err) => {
        return res.status(404).send(err);
    });
});

// 4. Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    new Promise((resolve, reject) => {
        let bookByTitle;
        for (let key in books) {
            if (books[key].title.toLowerCase() === title) {
                bookByTitle = books[key];
                break;
            }
        }
        if (bookByTitle) {
            resolve(bookByTitle);
        } else {
            reject("No book found under this title: " + req.params.title);
        }
    }).then((book) => {
        return res.send("This is the book information for title: " + req.params.title + ", " + JSON.stringify(book));
    }).catch((err) => {
        return res.status(404).json({ message: err });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbnForRev = req.params.isbn;
    new Promise((resolve, reject) => {
        let reviews;
        for (let key in books) {
            if (books[key].isbn === isbnForRev) {
                reviews = books[key].reviews;
                break;
            }
        }
        if (reviews) {
            resolve(reviews);
        } else {
            reject("No book or review found under this isbn: " + req.params.isbn);
        }
    }).then((reviews) => {
        return res.send("These are these reviews for isbn: " + req.params.isbn + ", " + JSON.stringify(reviews));
    }).catch((err) => {
        return res.status(404).json({ message: err });
    });
});

module.exports.general = public_users;
 