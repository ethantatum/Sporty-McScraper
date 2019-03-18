"use strict";

// REQUIRES ===============================================
const express = require("express");
const exphbs = require("express-handlebars");
// Morgan gives us some color-coordinated logging tokens
const logger = require("morgan");
const mongoose = ("mongoose");

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
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Connect to MongoDB
mongoose.connect("mongodb://localhost/sportScraperDB", { useNewUrlParser: true });

// ROUTING ================================================
// GET for scraping FTW
app.get('/scrape', function(req, res) {
    axios.get('https://ftw.usatoday.com/').then(function(response) {
        let $ = cheerio.load(response.data);
        $('div.content').each(function(i, element) {
            let result = {};

            result.title = $(this)
            .children('a')
            .attr('title');
            result.summary = $(this)
            .children('p')
            .text();
            result.link = $(this)
            .children('a')
            .attr('href');
            result.image = $(this)
            .children('img')
            .attr('src');

            // Create new Article in MongoDB
            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
        res.send('Sports scrape complete!');
    });
});

// Get all articles from DB
app.get('/articles', function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.render('index', dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Get a specific article with its comment
app.get('/articles/:id', function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate('comment')
    .then(function(dbArticle) {
        res.render('index', dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Post for saving/updating comments on articles
app.post('/articles/:id', function(req, res) {
    db.Comment.create(req.body)
    .then(function(dbComment) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
    })
})



app.listen(PORT, function() {
    console.log(`App running on http://localhost: ${PORT}`);
});