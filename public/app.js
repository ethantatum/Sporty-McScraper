// Grab all articles
$.get('/articles', function(data) {
    for (let i = 0;  i < data.length; i++) {
        // Display articles to page
        $('#articles').append(`<div data-id='${data[i]._id}'>
        <p class='article-time'>${data[i].time}</p><br>
        <h5 class='article-title'>${data[i].title}</h5><br>
        <h6 class='article-summary'>${data[i].summary}</h6><br>
        <a href='${data[i].link}' target='_blank'>${data[i].link}</a><br>
        <button class='comment-button' id='leave-comment' data-id='${data[i]._id}'>Leave a Comment!</button></div><br>`);
        if(data[i].commentArr.length > 0) {
            $('#articles').append(`<button class='comment-button' id='view-comments' data-id='${data[i]._id}'>View Comments!</button>`)    
        }
    }
});

// When user clicks view comments button
$(document).on('click', '#view-comments', function() {
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
                $('#comments').append(`<h2>Current Comments</h2>`);
                for (let j = 0; j < data.commentArr.length; j++) {
                    $('#comments').append(`<div class='comment-container'>            
                    <h5 id='comment-title'>${data.commentArr[j].commentTitle}</h5><br>
                    <p id='comment-body'>${data.commentArr[j].commentBody}</p></div><br>`);
                    }
            
                    
                });
            });
            
// When user clicks leave comment button
$(document).on('click', '#leave-comment', function() {
    // Empty comments section
    $('#comments').empty();
    //Save ID
    let thisID = $(this).attr('data-id');
    // Add comment insert box to page
    $('#comments').append(`<div class='insert-container'>
        <input id='titleinput' name='title' placeholder='Insert Comment Title'><br>
        <textarea id='bodyinput' name='body' placeholder='Insert Comment Here'></textarea><br>
        <button data-id='${thisID}' id='save-comment'>Save Comment</button></div>`);        
});

// When user clicks save comment button
$(document).on('click', '#save-comment', function() {
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
    window.location.reload();
});