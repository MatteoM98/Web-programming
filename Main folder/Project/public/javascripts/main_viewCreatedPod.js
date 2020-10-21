let yesButton = document.getElementsByClassName('modalbtn');
let modifyButton = document.getElementsByClassName('send-msg');

for (let btn of yesButton) {
    btn.addEventListener('click', event => {
        event.preventDefault();
        let podID = event.target.getAttribute("podcastID");
        let inputID = document.createElement('input');
        inputID.setAttribute('value', podID);
        inputID.setAttribute('name', 'podID');
        inputID.setAttribute('type', 'hidden');
        let idForm = 'modalForm' + podID;
        let form = document.getElementById(idForm);
        form.appendChild(inputID);
        /* Since the PUT and the DELETE are not supported 
           I create a field to distinguish the type of the 
           request
        */
       let typeReq = document.createElement('input');
       typeReq.setAttribute('value', 'DELETE');
       typeReq.setAttribute('name', 'typeReq');
       typeReq.setAttribute('type', 'hidden');
       form.appendChild(typeReq);

       form.submit();
    });
}

for (let btn of modifyButton) {
    btn.addEventListener('click', event => {
        event.preventDefault();
        let podID = event.target.getAttribute("podcastID");
        const idForm = 'modifyForm' + podID;
        let form = document.getElementById(idForm);
        let title = document.getElementById('recipient-title-'+podID);
        let des = document.getElementById('description-text-'+podID);
        let cat =  document.getElementById('category-'+podID);
        if(title.value === '' || des.value === '' || cat.value === '') {

            if(title.value === '') {
                title.style.backgroundColor = 'pink';
            } else {
                title.style.backgroundColor = '#99ff99';
            }

            if(des.value === '') {
                des.style.backgroundColor = 'pink';
            }else {
                des.style.backgroundColor = '#99ff99';
            }

            if(cat.value === '') {
                cat.style.backgroundColor = 'pink';
            }else {
                cat.style.backgroundColor = '#99ff99';
            }

        } else {
            let typeReq = document.createElement('input');
            typeReq.setAttribute('value', 'PUT');
            typeReq.setAttribute('name', 'typeReq');
            typeReq.setAttribute('type', 'hidden');

            //Field for podcast's ID
            let id = document.createElement('input');
            id.setAttribute('value', podID);
            id.setAttribute('name', 'podID');
            id.setAttribute('type', 'hidden');

            form.appendChild(typeReq);
            form.appendChild(id);
            form.submit();
        }
    });
}