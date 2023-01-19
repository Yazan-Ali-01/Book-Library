const path = require("path");
const isAdmin = require("../middleware/isAdmin");

const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/add-product", isAdmin, adminController.getAddProduct);

router.post("/add-product", isAdmin, adminController.postAddProduct);

router.get(
  "/edit-product/:productId",
  isAdmin,
  adminController.getEditProducts
);

router.post("/edit-product/", isAdmin, adminController.postEditProduct);

router.get("/add-genre", isAdmin, adminController.getAddGenre);

router.post("/add-genre", isAdmin, adminController.postAddGenre);

router.get("/add-author", isAdmin, adminController.getAddAuthor);

router.post("/add-author", isAdmin, adminController.postAddAuthor);

router.get("/delete-book", isAdmin, adminController.getDeleteBook);

router.post("/delete-book", isAdmin, adminController.postDeleteBook);

router.post(
  "/delete-book-home",
  isAdmin,
  adminController.postDeleteBookFromHome
);

module.exports = router;
