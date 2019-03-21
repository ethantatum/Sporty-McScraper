// Grab all articles
$.getJSON('/articles', function(data) {
    let hbsObj = {
        articles: data
    };
    res.render('index', hbsObj);
});

// When user clicks comment button
$('.comment-button').on('click', function() {
    // Empty current comments
    $('.comments').empty();
    // Save ID from button
    let thisID = $(this).attr('data-id');

    // Ajax call for article
    $.ajax({
        method: 'GET',
        url: `/articles/${thisID}`
    })
        // Send info to page
        .then(function(data) {
            console.log(data);
            let hbsObj = {
                articles: data
            }
            res.render('index', hbsObj)
        })
        .then(function(data) {
            // Comments header
            $('#comments').append(`<h2>Comments</h2>`);
            // Comments title
            $('#comments').append(`<input id='titleinput' name='title' >`);
            // Comments body input
            $('#comments').append(`<textarea id='bodyinput' name='body'></textarea>`);
            // A button to submit a new comment, with the id of the article saved to it
            $("#comments").append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`);

            // If there's a comment
            if (data.comment) {
                $('#titleinput').val(data.comment.commentTitle);
                $('#bodyinput').val(data.comment.commentBody);
            }
            
        });
});