const { generateKey } = require("crypto");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Author = require("../models/author");
const Book = require("../models/book");
const Genre = require("../models/genre");
const BookGenre = require("../models/book_genre");
const { Result } = require("express-validator");
const ITEMS_PER_PAGE = 20;

exports.getIndex = (req, res, next) => {
  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  if (req.query.genre) {
    const page = +req.query.page || 1;
    let totalItems;
    let genreId;
    let genre_title = [];
    let allGenres;
    Genre.findById(req.query.genre)
      .then((genre) => {
        genre_title.push(genre.title);
        console.log(genre_title);
        genreId = mongoose.Types.ObjectId(genre._id);
        // console.log(genre);
        // console.log(genreId);
        BookGenre.find({ genre_id: genreId })
          .then(async (allBookGenres) => {
            // console.log(allBookGenres);
            book_ids = allBookGenres.map((element) => {
              return element.book_id;
            });
            console.log(book_ids);
            Genre.find().then((genres) => {
              allGenres = genres;
            });
            // const records = await Book.find().where('_id').in(book_ids).exec();
            Book.find()
              .where("_id")
              .in(book_ids)
              .countDocuments()
              .exec()
              .then((numBooks) => {
                console.log(numBooks);
                totalItems = numBooks;
              });
            return Book.find()
              .where("_id")
              .in(book_ids)
              .populate("author_id")
              .sort({ createdAt: -1 })
              .skip((page - 1) * ITEMS_PER_PAGE)
              .limit(ITEMS_PER_PAGE);
          })
          .then((books) => {
            // console.log(books);
            res.render("shop/index", {
              genre_title: genre_title,
              genres: allGenres,
              books: books,
              pageTitle: "Main Page",
              path: "/",
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalItems,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const page = +req.query.page || 1;
    let totalItems;
    let allGenres;

    Author.find({ name: regex })
      .then(async (author) => {
        if (author.length < 1) {
          author.push({ _id: mongoose.Types.ObjectId(Math.random()) });
        }
        const numBooks = await Book.find({
          $or: [
            { title: regex },
            { description: regex },
            { author_id: author[0]._id },
          ],
        }).countDocuments();
        totalItems = numBooks;
        Genre.find().then((genres) => {
          allGenres = genres;
        });
        return await Book.find({
          $or: [
            { title: regex },
            { description: regex },
            { author_id: author[0]._id },
          ],
        })
          .populate("author_id")
          .sort({ createdAt: -1 })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then((books) => {
        console.log(books);
        res.render("shop/index", {
          genre_title: null,
          genres: allGenres,
          books: books,
          pageTitle: "Main Page",
          path: "/",
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
      });
  } else {
    const page = +req.query.page || 1;
    let allGenres;
    Genre.find()
      .then((genres) => {
        allGenres = genres;
      })
      .then((genres) => {
        return Book.find().countDocuments();
      })
      .then((numBooks) => {
        totalItems = numBooks;

        return Book.find()
          .populate("author_id")
          .sort({ createdAt: -1 })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then((books) => {
        res.render("shop/index", {
          isAuthenticated: false,
          genre_title: null,
          genres: allGenres,
          books: books,
          pageTitle: "Main Page",
          path: "/",
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
};
