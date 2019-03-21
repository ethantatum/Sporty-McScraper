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
        // Send info to Handlebars
        .then(function(data) {
            console.log(data);
            let hbsObj = {
                articles: data
            }
            res.render('index', hbsObj);
        })
});