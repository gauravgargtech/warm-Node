const homeController = require("../controllers/index");
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  console.log("Url : ", req.url);
  next();
});

router.get("/", homeController.home);

router.get("/plans", homeController.plans);

router.get("/privacy-policy", homeController.policy);

router.get("/faq", homeController.faq);

router.get("/terms-and-conditions", homeController.terms);

router.get("/contact", homeController.contact);

router.post(
  "/contact",
  check("email").isEmail().withMessage("Please enter valid email"),
  check("name")
    .isLength({ min: 2, max: 50 })
    .withMessage("Please enter your password "),
  check("message")
    .isLength({ min: 2, max: 1000000 })
    .withMessage("Please add a message"),
  homeController.contactSubmit
);

router.get("/blog", homeController.blog);

router.get("/blog/:url", homeController.blogDetail);

module.exports = router;
