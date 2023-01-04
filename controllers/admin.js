const mongoose = require("mongoose");

const { validationResult } = require("express-validator/check");

const Book = require("../models/book");
const Genre = require("../models/genre");
const BookGenre = require("../models/book_genre");
const Author = require("../models/author");
const { ObjectId } = require("mongodb");

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const genreId = req.body.genreId;
  const authorId = req.body.authorId;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const likes = 0;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/add-edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const book = new Book({
    // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
    title: title,
    author_id: authorId,
    description: description,
    imageUrl: imageUrl,
    likes: likes,
  });
  book
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      const book_genre = new BookGenre({
        book_id: book._id,
        genre_id: genreId,
      });
      console.log(book_genre);
      return book_genre.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddProduct = async (req, res, next) => {
  const genres = await Genre.find();
  const books = await Book.find();
  const authors = await Author.find();
  res.render("admin/add-edit-product", {
    genre_title: null,
    authors: authors,
    genres: genres,
    books: books,
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.getEditProducts = async (req, res, next) => {
  const prodId = req.params.productId;
  const authors = await Author.find();
  Genre.find()
    .then((genres) => {
      Book.findById(prodId).then((book) => {
        console.log(book);
        if (!book) {
          return res.redirect("/");
        }
        res.render("admin/add-edit-product", {
          editMode: true,
          genre_title: null,
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
          books: [book],
          genres: genres,
          authors: authors,
          hasError: false,
          errorMessage: null,
          validationErrors: [],
        });
      });
    })

    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  let prodId = req.body.productId;
  prodId = mongoose.Types.ObjectId(prodId);
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Book.findById(prodId)
    .then((book) => {
      console.log(book);
      book.title = updatedTitle;
      book.description = updatedDesc;
      book.imageUrl = updatedImageUrl;
      book.author_id = book.author_id;
      book.likes = book.likes;
      return book.save();
    })
    .then((result) => {
      console.log("UPDATED Book!");
      res.redirect("/admin/delete-book");
    })
    .catch((err) => console.log(err));
};

exports.getAddGenre = (req, res, next) => {
  Genre.find().then((genres) => {
    Book.find().then((book) => {
      console.log("test");
      res.render("admin/add-genre", {
        genre_title: null,
        pageTitle: "Add Genre",
        path: "/admin/add-genre",
        books: book,
        genres: genres,
      });
    });
  });
};
exports.postAddGenre = (req, res, next) => {
  const title = req.body.genreTitle;

  const genre = new Genre({
    title: title,
  });
  genre.save().then((result) => {
    res.redirect("/");
  });
};

exports.getDeleteBook = (req, res, next) => {
  Genre.find().then((genres) => {
    Book.find()
      .populate("author_id")
      .sort({ createdAt: -1 })
      .then((book) => {
        res.render("admin/delete-book", {
          genre_title: null,
          pageTitle: "Delete Book",
          path: "/admin/delete-product",
          books: book,
          genres: genres,
        });
      });
  });
};

exports.postDeleteBookFromHome = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.body.bookId.trim());

  Book.findByIdAndRemove(id).then((result) => {
    res.redirect("/");
  });
};

exports.postDeleteBook = (req, res, next) => {
  // console.log(req.body.bookId);
  // req.body.bookId = +req.body.bookId;
  // console.log(req.body.bookId);
  const id = mongoose.Types.ObjectId(req.body.bookId.trim());
  console.log(id);
  Book.findByIdAndRemove(id).then((result) => {
    // console.log(result);
    res.redirect("/admin/delete-book");
  });
};
