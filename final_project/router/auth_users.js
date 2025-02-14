const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid (e.g., not already taken)
const isValid = (username) => {
    return !users.some(user => user.username === username);
}

// Function to authenticate user by username and password
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate that username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user is authenticated
    if (authenticatedUser(username, password)) {
        // Generate a JWT token
        let accessToken = jwt.sign({ username: username }, "access", { expiresIn: '1h' });
        
        // Save the token in the session
        req.session.authorization = { accessToken };
        
        return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    if (books[isbn]) {
        // Add or modify the review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added/modified successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;