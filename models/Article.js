let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: 'Click the article link to find out more!'
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://usatftw.files.wordpress.com/2015/11/logo-ftw.png'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

let Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;