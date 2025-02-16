const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));  ;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    let bookByIsbn = null;

    for (let key in books) {
        if (books[key].isbn === ISBN) {
            bookByIsbn = books[key];
            break;
        }
    }

    if (bookByIsbn) {
        return res.send("The book details for ISBN number: " + ISBN + ", are: " + JSON.stringify(bookByIsbn));
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
        return res.send("This is/are the book(s) by this author: " + JSON.stringify(booksByAuthor));
    } else {
        return res.status(404).send("No books found for the author: " + req.params.author);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  let bookByTitle;

  for (let key in books){
    if(books[key].title.toLowerCase() === title){
         bookByTitle = books[key];
         break;
    }
  }
  if(bookByTitle){
    return res.send("This is the book information for title: " +req.params.title + ", " + bookByTitle)
  }else{
    return res.status(404).json({message: "No book found under this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnForRev = req.params.isbn;
  let reviews;
  for (let key in books){
    if(books[key].isbn === isbnForRev){
        reviews = books[key].reviews;
        break;
    }
  }
  if(reviews){
    return res.send("These are these reviews for isbn: " + req.params.isbn + ", " + JSON.stringify(reviews))
  }else{
    return res.status(404).json({message: "No book or review found under this isbn"});
  }
});

module.exports.general = public_users;
 