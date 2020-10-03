const homeController = require("../controllers/index");
const express = require("express");
const router = express.Router();

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

router.get("/blog", homeController.blog);

router.get("/blog/:url", homeController.blogDetail);

module.exports = router;
