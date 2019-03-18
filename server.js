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
// GET for scraping SBNation
app.get('/scrape', function(req, res) {
    axios.get('https://www.sbnation.com/').then(function(response) {
        let $ = cheerio.load(response.data);
        $('h2').each(function(i, element) {
            let result = {};

            result.title = $(this)
            .children('a')
            .text();
            result.summary = $(this)
            // find on sbnation
            result.link = $(this)
            .children('a')
            .attr('href');

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





app.listen(PORT, function() {
    console.log(`App running on http://localhost: ${PORT}`);
});