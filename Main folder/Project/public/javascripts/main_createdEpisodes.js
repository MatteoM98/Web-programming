let confirmDelBtn = document.getElementById('confirm-delete-btn');
let confirmModBtn = document.getElementById('confirm-modify-btn');


confirmDelBtn.addEventListener('click',event => {
    event.preventDefault();
    let episodeID = event.target.getAttribute('episodeID');

    let inputID = document.createElement('input');
    inputID.setAttribute('name', 'episodeID');
    inputID.setAttribute('type', 'hidden');
    inputID.setAttribute('value',episodeID);

    let typeReq = document.createElement('input');
    typeReq.setAttribute('value', 'DELETE');
    typeReq.setAttribute('name', 'typeReq');
    typeReq.setAttribute('type', 'hidden');

    let form = document.getElementById('deleteForm');
    form.appendChild(inputID);
    form.appendChild(typeReq);
    form.submit();
});

confirmModBtn.addEventListener('click',event => {
    event.preventDefault();
    let episodeID = event.target.getAttribute('episodeID'); 

    let title = document.getElementById('recipient-title');
    let des = document.getElementById('description-text');
    let date = document.getElementById('recipient-date');
    let price = document.getElementById('episodePrice');

    if (title.value === '' || des.value === '' || date.value === '' || price.value === '') {
        
        if(title.value === '') {
            title.style.backgroundColor = 'pink'
        } else {
            title.style.backgroundColor = '#99ff99'
        }

        if(des.value === '') {
            des.style.backgroundColor = 'pink'
        } else {
            des.style.backgroundColor = '#99ff99'
        }

        if(date.value === '') {
            date.style.backgroundColor = 'pink'
        } else {
            date.style.backgroundColor = '#99ff99'
        }

        if(price.value === '') {
            price.style.backgroundColor = 'pink'
        } else {
            price.style.backgroundColor = '#99ff99'
        }
    } else {

        let inputID = document.createElement('input');
        inputID.setAttribute('name', 'episodeID');
        inputID.setAttribute('type', 'hidden');
        inputID.setAttribute('value',episodeID);
    
        let typeReq = document.createElement('input');
        typeReq.setAttribute('value', 'PUT');
        typeReq.setAttribute('name', 'typeReq');
        typeReq.setAttribute('type', 'hidden');
    
        let form = document.getElementById('modifyForm');
        form.appendChild(inputID);
        form.appendChild(typeReq);
        form.submit();
    }

});

$('#deleteModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let episodeID = button.data('whatever') // Extract info from data-* attributes
    let modal = $(this)
    modal.find('#confirm-delete-btn').attr('episodeID',episodeID);
})

$('#modifyModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let episodeID = button.data('whatever') // Extract info from data-* attributes
    let modal = $(this)
    modal.find('#confirm-modify-btn').attr('episodeID',episodeID);
})




