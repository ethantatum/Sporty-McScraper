// REQUIRES ===============================================
const express = require("express");
const exphbs = require("express-handlebars");
// Morgan gives us some color-coordinated logging tokens
const logger = require("morgan");
const mongoose = require("mongoose");

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// All models
const db = require("./models");

const PORT = process.env.PORT || 8080;

const app = express();

// CONFIGURE MIDDLEWARE ===================================
// Concise output colored by response status for development use.
// The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(logger("dev"));
// Parse request as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public folder accessible
app.use(express.static("public"));

// Use Handlebars engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to MongoDB
// If deployed, use the deployed database. Otherwise use the local sportScraperDB database
let MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/sportScraperDB";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// ROUTING ================================================
// GET for scraping
app.get("/scrape", function (req, res) {
  axios
    .get("https://www.theonion.com/c/sports-news-in-brief")
    .then(function (response) {
      let $ = cheerio.load(response.data);
      $("article").each(function (i, element) {
        let result = {};

        result.title = $(this).find("h1.headline.entry-title").text();
        result.summary = $(this).find(".excerpt p").text();
        result.link = $(this).find("a.js_link").attr("href");
        result.time = $(this).find("time").attr("datetime");

        // Create new Article in MongoDB
        db.Article.create(result)
          .then(function (dbArticle) {})
          .catch(function (err) {
            console.log(err);
          });
      });
      res.send("Sports scrape complete!");
    });
});

// Get all articles from DB
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Get a specific article with its comment
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("commentArr")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Post for saving/updating comments on articles
app.post("/articles/:id", function (req, res) {
  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { commentArr: dbComment._id } },
        { new: true }
      );
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log(`App running on http://localhost: ${PORT}`);
});
