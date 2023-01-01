const bcrypt = require("bcryptjs");
const User = require("../models/user");

const { validationResult } = require("express-validator/check");

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
              return res.redirect("/");
            });
          }
          req.flash("error", "Invalid Email or Password.");
          res.redirect("/login");
        })
        .catch((err) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
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
  const confirmPassword = req.body.confirmPassword;
  let errors = validationResult(req);
  let isAdmin;
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }
  if (name.substring(0, 5) == "Admin") {
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
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email or Password.");
        return res.redirect("/reset");
      }
      bcrypt
        .compare(oldPassword, user.password)
        .then((doMatch) => {
          if (doMatch) {
            bcrypt
              .hash(newPassword, 12)
              .then((hashedPw) => {
                user.name = user.name;
                user.email = user.email;
                user.password = hashedPw;
                user.isAdmin = user.isAdmin;
                return user.save();
              })
              .then((result) => {
                res.redirect("/login");
              });
          } else {
            req.flash("error", "Invalid Email or Password.");
            res.redirect("/reset");
          }
        })

        .catch((err) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
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
