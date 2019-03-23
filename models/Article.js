let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        default: 'Click the article link to find out more!'
    },
    link: {
        type: String,
        required: true
    },
    time: {
        type: Date
    },                      
    commentArr: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
    
});

let Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;