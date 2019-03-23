// Grab all articles
$.get('/articles', function(data) {
    for (let i = 0;  i < data.length; i++) {
        // Display articles to page
        let time = moment(data[i].time).startOf('day').fromNow();
        $('#articles').append(`<div class='content-box border border-dark rounded-right pl-2 py-3 mb-1' data-id='${data[i]._id}'>
        <p class='article-time'>${time}</p>
        <h4 class='article-title font-weight-bold'>${data[i].title}</h4><br>
        <h5 class='article-summary'>${data[i].summary}</h5>
        <a href='${data[i].link}' target='_blank'>${data[i].link}</a><br>
        <button class='comment-button mr-2 my-2 float-right rounded' id='leave-comment' data-id='${data[i]._id}'>Leave a Comment!</button>
        <div id='${data[i]._id}'</div></div><br>`);
        if(data[i].commentArr.length > 0) {
            $(`#${data[i]._id}`).append(`<button class='comment-button mr-2 my-2 float-right rounded' id='view-comments' data-id='${data[i]._id}'>View Comments!</button>`)    
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
                $('#comments').append(`<h2 class='text-white'>Current Comments</h2>`);
                for (let j = 0; j < data.commentArr.length; j++) {
                    $('#comments').append(`<div class='content-box comment-container border border-dark rounded-left pl-2 pt-2 mb-1'>            
                    <h4 class='font-weight-bold' id='comment-title'>${data.commentArr[j].commentTitle}</h4>
                    <p id='comment-body'>${data.commentArr[j].commentBody}</p></div>`);
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
    $('#comments').append(`<h2 class='text-white'>Leave a Comment</h2>`);
    $('#comments').append(`<div class='insert-container content-box border border-dark rounded-left pl-2 py-2'>
        <input id='titleinput' name='title' placeholder='Insert Comment Title'><br>
        <textarea id='bodyinput' name='body' placeholder='Insert Comment Here'></textarea><br>
        <button class='rounded' data-id='${thisID}' id='save-comment'>Save Comment</button></div>`);        
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