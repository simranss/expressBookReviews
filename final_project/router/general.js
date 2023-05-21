const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

let getAllBooks = new Promise((resolve,reject) => {
  resolve(books);
});

let getBookByISBN = function(isbn) {
  return new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
};

let getBooksByAuthor = function(author) {
  return new Promise((resolve, reject) => {
    const tempBooks = [];
    const keys = Object.keys(books);
    for (let key of keys) {
      let book = books[key];
      if (author === book["author"]) {
        tempBooks.push(book);
      }
    }
    resolve(tempBooks);
  });
};

let getBooksByTitle = function(title) {
  return new Promise((resolve, reject) => {
    const tempBooks = [];
    const keys = Object.keys(books);
    for (let key of keys) {
      let book = books[key];
      if (title === book["title"]) {
        tempBooks.push(book);
      }
    }
    resolve(tempBooks);
  });
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getAllBooks.then((result) => res.send(JSON.stringify(result, null, 8)))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  getBookByISBN(isbn).then((book) => res.send(JSON.stringify(book, null, 8)));
  // const book = books[isbn];
  // res.send(JSON.stringify(book, null, 8));
  //return res.status(300).json({message: "Yet to be implemented"});
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //const tempBooks = [];
  const author = req.params.author;
  // const keys = Object.keys(books);
  // for (let key of keys) {
  //   let book = books[key];
  //   if (author === book["author"]) {
  //     tempBooks.push(book);
  //   }
  // }
  getBooksByAuthor(author).then((tempBooks) => res.send(JSON.stringify(tempBooks, null, 8)))
  //res.send(JSON.stringify(tempBooks, null, 8));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //const tempBooks = [];
  const title = req.params.title;
  // const keys = Object.keys(books);
  // for (let key of keys) {
  //   let book = books[key];
  //   if (title === book["title"]) {
  //     tempBooks.push(book);
  //   }
  // }
  getBooksByTitle(title).then((tempBooks) => res.send(JSON.stringify(tempBooks, null, 8)));
  // res.send(JSON.stringify(tempBooks, null, 8));
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  const review = book["reviews"];
  res.send(review);
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
