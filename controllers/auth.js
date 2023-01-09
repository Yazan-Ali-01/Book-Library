const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const path = require("path");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
var handlebars = require("handlebars");
var fs = require("fs");
let transporter;
let userToReset;

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

if (process.env.NODE_ENV === "production") {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const accessToken = oAuth2Client.getAccessToken().then((result) => {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "book.library.dev@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
  });
}

const { validationResult } = require("express-validator/check");
const { default: mongoose } = require("mongoose");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email or Password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          req.session.isAdmin = true;
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              req.flash("error", "Invalid Email or Password.");
              return res.redirect("/");
            });
          }

          res.redirect("/login");
        })
        .catch((err) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log("err"));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let errors = validationResult(req);
  let isAdmin;
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }
  if (name.substring(0, 5) == process.env.SECRET) {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      req.flash("error", "Email Already Exists");
      res.redirect("/signup");
    } else {
      return bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPw,
            isAdmin: isAdmin,
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email })
    .then((user) => {
      userToReset = user;
      if (!user) {
        req.flash("error", "Invalid Email");
        return res.redirect("/reset");
      }
      const JWT_SECRET = "verystrongsecret";
      const secret = JWT_SECRET + user.password;
      const payload = {
        email: user.email,
        id: user._id.toString(),
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const link = `http://localhost:3000/reset-password/${user._id.toString()}/${token}`;
      console.log(link);
      if (process.env.NODE_ENV === "production") {
        readHTMLFile(
          path.join(
            __dirname,
            "..",
            "public",
            "reset-email",
            "mail-template.html"
          ),
          function (err, html) {
            if (err) {
              console.log("error reading file", err);
              return;
            }
            var template = handlebars.compile(html);
            var replacements = {
              name: user.name,
              action_url: link,
              support_url: "book.library.dev@gmail.com",
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
              from: "book.library.dev@gmail.com",
              to: user.email,
              subject: "Password Reset",
              html: htmlToSend,
            };
            transporter.sendMail(mailOptions, function (error, response) {
              if (error) {
                console.log(error);
              } else {
                console.log("done");
              }
            });
          }
        );
        res.render("email-sent");
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const { id, token } = req.params;
  console.log(mongoose.Types.ObjectId(id));
  console.log(userToReset);
  console.log(userToReset._id);
  if (id !== userToReset._id.toString()) {
    return res.redirect("/login");
  } else {
    const JWT_SECRET = "verystrongsecret";
    const secret = JWT_SECRET + userToReset.password;
    try {
      const payload = jwt.verify(token, secret);
      res.render("auth/reset-password", {
        pageTitle: "Reset Password",
        path: "auth/reset-password",
        errorMessage: message,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  }
};
exports.postResetPassword = (req, res, next) => {
  const { password } = req.body;
  const { id, token } = req.params;
  console.log(token);
  try {
    const JWT_SECRET = "verystrongsecret";
    const secret = JWT_SECRET + userToReset.password;

    const tokenVerify = jwt.verify(token, secret);
    User.findOne({ email: userToReset.email }).then((userDoc) => {
      console.log(userDoc);
      bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
          userDoc.name = userDoc.name;
          userDoc.email = userDoc.email;
          userDoc.password = hashedPw;
          userDoc.isAdmin = userDoc.isAdmin;
          return userDoc.save();
        })
        .then((result) => {
          console.log(userDoc);
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (error) {
    console.log(error.message);
  }
};

// exports.postLogin = (req, res, next) => {
//   User.findById("5bab316ce0a7c75f783cb8a8")
//     .then((user) => {
//       req.session.isLoggedIn = true;
//       req.session.user = user;
//       req.session.save((err) => {
//         console.log(err);
//         res.redirect("/");
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.postLogout = (req, res, next) => {
//   req.session.destroy((err) => {
//     console.log(err);
//     res.redirect("/");
// const User = require("../models/user");

// exports.getLogin = (req, res, next) => {
//   res.render("auth/login", {
//     path: "/login",
//     pageTitle: "Login",
//     isAdmin: false,
//   });
// };
//   });
// };
// if (process.env.NODE_ENV === "production") {
//   transporter
//     .sendMail({
//       to: "yazan.ali.dev@gmail.com",
//       from: "Book Library Website <book.library.dev@gmail.com>",
//       subject: "test",
//       html: "<h1>thats a test</h1>",
//     })
//     .then(res.redirect("/"));
// } else {
//   res.redirect("/");
// }
