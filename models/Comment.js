let mongoose = require('mongoose');

let Schema = mongoose.Schema;

// Should set this up as an array so users can add multiple comments, rather than one that gets overwritten
let CommentSchema = new Schema({
        commentTitle: String,
        commentBody: String
    });

let Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;