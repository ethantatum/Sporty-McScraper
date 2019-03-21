// Grab all articles
$.get('/articles', function(data) {
    for (let i = 0;  i < data.length; i++) {
        // Display articles to page
        $('#articles').append(`<div data-id='${data[i]._id}'>
        <p class='article-time'>${data[i].time}</p><br>
        <h5 class='article-title'>${data[i].title}</h5><br>
        <h6 class='article-summary'>${data[i].summary}</h6><br>
        <a href='${data[i].link}' target='_blank'>${data[i].link}</a><br>
        <button class='comment-button' data-id='${data[i]._id}'>Leave a Comment!</button></div>
        <button class='comment-button' data-id='${data[i]._id}'>View Comments!</button></div><br>`);
    }
});

// When user clicks comment button
$(document).on('click', '.comment-button', function() {
    // Empty comments section
    $('#comments').empty();
    //Save ID
    let thisID = $(this).attr('data-id');

    // AJAX GET call
    $.ajax({
        method: 'GET',
        url: `/articles/${thisID}`
    })
        // Add comment information to page
        .then(function(data) {
            console.log(data.commentArr);
            if (data.commentArr.length > 0) {
                for (let j = 0; j < data.commentArr.length; j++) {
                    $('#comments').append(`<div class='comment-container'>
                    <input id='titleinput' name='title' value='${data.commentArr[j].commentTitle}'><br>
                    <textarea id='bodyinput' name='body' placeholder='${data.commentArr[j].commentBody}'></textarea><br>
                    <button data-id='${data._id}' id='savenote'>Save Comment</button></div>`);
                    }
            }
            else {
                $('#comments').append(`<div class='comment-container'>
                    <input id='titleinput' name='title' value='Insert Comment Title'><br>
                    <textarea id='bodyinput' name='body' placeholder='Insert Comment Here'></textarea><br>
                    <button data-id='${data._id}' id='savenote'>Save Comment</button></div>`);
            }
        
        });
    });

// When user clicks save comment button
$(document).on('click', '#savenote', function() {
    // Grab ID
    let thisID = $(this).attr('data-id');

    // AJAX POST
    $.ajax({
        method: 'POST',
        url: `/articles/${thisID}`,
        data: {
            commentTitle: $('#titleinput').val().trim(),
            commentBody: $('#bodyinput').val().trim()
        }
    })
    .then(function(data) {
        console.log(data);
        $('#comments').empty();
    });
    $('#titleinput').val('');
    $('#bodyinput').val('');
});