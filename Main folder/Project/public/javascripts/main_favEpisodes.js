let confirmDelBtn = document.getElementById('confirm-delete-btn');

confirmDelBtn.addEventListener('click',event => {
    event.preventDefault();
    let episodeID = event.target.getAttribute('episodeID');

    let inputID = document.createElement('input');
    inputID.setAttribute('name', 'episodeID');
    inputID.setAttribute('type', 'hidden');
    inputID.setAttribute('value',episodeID);

    let form = document.getElementById('deleteForm');
    form.appendChild(inputID);
    form.submit();
});

$('#deleteModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let episodeID = button.data('whatever') // Extract info from data-* attributes
    let modal = $(this)
    modal.find('#confirm-delete-btn').attr('episodeID',episodeID);
})