const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const csrf = require("csurf");
const csvtojson = require("csvtojson");
const User = require("./models/user");
const Book = require("./models/book");
const bookGenre = require("./models/book_genre");
const Author = require("./models/author");
const Genre = require("./models/genre");

const MONGODB_URI = process.env.MONGODB_URI;
const connectionOptions = {
  dbName: "book_store",
};

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "somesupersecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

// app.use((req, res, next) => {
//   // throw new Error('Sync Dummy');
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then((user) => {
//       if (!user) {
//         return next();
//       }
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       next(new Error(err));
//     });
// });

app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(authRoutes);

mongoose
  .connect(MONGODB_URI, connectionOptions)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    if (MONGODB_URI.slice(0, 9) === "mongodb:/") {
      Book.find()
        .countDocuments()
        .then((count) => {
          if (count > 0) {
            return;
          }
          csvtojson()
            .fromFile("./dbData/Books.csv")
            .then((csvData) => {
              Book.insertMany(csvData);
            })
            .then(
              csvtojson()
                .fromFile("./dbData/Authors.csv")
                .then((csvData) => {
                  Author.insertMany(csvData);
                })
            )
            .then(
              csvtojson()
                .fromFile("./dbData/BookGenres.csv")
                .then((csvData) => {
                  bookGenre.insertMany(csvData);
                })
            )
            .then(
              csvtojson()
                .fromFile("./dbData/Genres.csv")
                .then((csvData) => {
                  Genre.insertMany(csvData);
                })
            )
            .catch((err) => {
              console.log(err);
            });
        });
    }
    console.log("Started Server #");
  })
  .catch((err) => {
    console.log(err);
  });
