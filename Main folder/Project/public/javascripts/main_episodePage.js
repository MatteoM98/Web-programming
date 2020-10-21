let createCommentBtn = document.getElementById('create-comment-button');
let confirmDelBtn = document.getElementById('confirm-delete-button');
let confirmModifyBtn = document.getElementById('modify-comment-button');


createCommentBtn.addEventListener('click', event => {
    event.preventDefault();
    let btn = event.target;
    let username = btn.getAttribute('user');
    if(username === 'false') {
        alert('Please, you need log in or sign up');
    } else {
        let episodeID = btn.getAttribute('episodeid');

        let inputID = document.createElement('input');
        inputID.setAttribute('name', 'episodeID');
        inputID.setAttribute('type','hidden');
        inputID.setAttribute('value',episodeID);

        let form = document.getElementById('create-comment-form');
        form.appendChild(inputID);
        form.submit();
        event.stopPropagation();
    }
});

confirmDelBtn.addEventListener('click', event => {
    event.preventDefault();
    let btn = event.target;
    let commentID = btn.getAttribute('commentID');
    let episodeID = btn.getAttribute('episodeID');

    let inputID = document.createElement('input');
    inputID.setAttribute('name', 'commentID');
    inputID.setAttribute('type','hidden');
    inputID.setAttribute('value',commentID);

    let inputEpID = document.createElement('input');
    inputEpID.setAttribute('name', 'episodeID');
    inputEpID.setAttribute('type','hidden');
    inputEpID.setAttribute('value',episodeID);

    let form = document.getElementById('delete-comment-form');
    form.appendChild(inputID);
    form.appendChild(inputEpID);
    form.submit();
    event.stopPropagation();
});

confirmModifyBtn.addEventListener('click', event => {
    event.preventDefault();
    let btn = event.target;
    let commentID = btn.getAttribute('commentID');
    let episodeID = btn.getAttribute('episodeID');

    let inputID = document.createElement('input');
    inputID.setAttribute('name', 'commentID');
    inputID.setAttribute('type','hidden');
    inputID.setAttribute('value',commentID);

    let inputEpID = document.createElement('input');
    inputEpID.setAttribute('name', 'episodeID');
    inputEpID.setAttribute('type','hidden');
    inputEpID.setAttribute('value',episodeID);

    let form = document.getElementById('modify-comment-form');
    form.appendChild(inputID);
    form.appendChild(inputEpID);
    form.submit();
    event.stopPropagation();
});

$('#deleteCommentModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let commentID = button.data('whatever') // Extract info from data-* attributes
    let modal = $(this)
    modal.find('#confirm-delete-button').attr('commentID',commentID);
})

$('#modifyCommentModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let commentID = button.data('whatever') // Extract info from data-* attributes
    let modal = $(this)
    modal.find('#modify-comment-button').attr('commentID',commentID);
})
