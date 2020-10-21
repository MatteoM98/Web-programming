let addFavBtn = document.getElementsByClassName('add-fav-button');

for (let btn of addFavBtn) {
    btn.addEventListener('click', event => {
        event.preventDefault();
        let btn = event.target;
        let authAttr = btn.getAttribute('auth');
        let hasCC = btn.getAttribute('hasCC');
        if(authAttr === 'false') {
            alert('Please, you need log in or sign up')
        } else {
            let price = parseFloat(btn.getAttribute('price'));
            if(price>0) {
                // has CC ?
                if (hasCC === 'true') {
                    //add episode to favorites
                    let episodeID = btn.getAttribute('episodeID');

                    let inputID = document.createElement('input');
                    inputID.setAttribute('name', 'episodeID');
                    inputID.setAttribute('type','hidden');
                    inputID.setAttribute('value',episodeID);

                    let form = document.getElementById(episodeID + 'Favorites');
                    form.appendChild(inputID);
                    form.submit();
                } else {
                    alert('Registra una CC dal tuo profilo');
                }

            } else {
            //add episode to favorites
            let episodeID = btn.getAttribute('episodeID');

            let inputID = document.createElement('input');
            inputID.setAttribute('name', 'episodeID');
            inputID.setAttribute('type','hidden');
            inputID.setAttribute('value',episodeID);

            let form = document.getElementById(episodeID + 'Favorites');
            form.appendChild(inputID);
            form.submit();
            }
        }
    })
}