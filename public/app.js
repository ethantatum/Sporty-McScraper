// Grab all articles
$.get('/articles', function(data) {
    for (let i = 0;  i < data.length; i++) {
        // Display articles to page
        $('#articles').append(`<div data-id='${data[i]._id}'>
        <p class='article-time'>${data[i].time}</p><br>
        <h5 class='article-title'>${data[i].title}</h5><br>
        <h6 class='article-summary'>${data[i].summary}</h6><br>
        <a href='${this[i].link}' target='_blank'></a><br>
        <button class='comment-button' data-id='${data[i]._id}'>Leave a Comment!</button></div><br>`);
    }
});

// When user click comment button
$('.comment-button').on('click', function() {
    // Empty comments section
    $('#comments').empty();
    //Save ID
    let thisID = $(this).attr('data-id');

    // AJAX call
    $.ajax({
        method: 'GET',
        url: `/articles/${thisID}`
    })
        // Add comment information to page
        .then(function(data) {
            console.log(data);
            $('#comments').append(`<div class='comment-container'>
            <h2 class='comment-title'>${data.title}</h2><br>
            <input id='titleinput' name='title'><br>
            <textarea id='bodyinput' name='body'></textarea><br>
            <button data-id='${data._id}' id='savenote'>Save Note</button></div>`);

            if (data.comment) {
                $('#titleinput').val(data.comment.commentTitle);
                $('#bodyinput').val(data.comment.commentBody);
            }
        });
});