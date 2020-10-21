let confirmDelBtn = document.getElementById('confirm-delete-btn');

confirmDelBtn.addEventListener('click',event => {
    event.preventDefault();
    let podcastID = event.target.getAttribute('podcastID');

    let inputID = document.createElement('input');
    inputID.setAttribute('name', 'podcastID');
    inputID.setAttribute('type', 'hidden');
    inputID.setAttribute('value',podcastID);

    let form = document.getElementById('deleteForm');
    form.appendChild(inputID);
    form.submit();
});

$('#confirmModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let podcastID = button.data('whatever') // Extract info from data-* attributes
    let modal = $(this)
    modal.find('#confirm-delete-btn').attr('podcastID',podcastID);
})