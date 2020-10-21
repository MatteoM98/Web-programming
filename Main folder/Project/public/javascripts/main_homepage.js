let followBtn = document.getElementsByClassName('follow-button');
let addFavBtn = document.getElementsByClassName('add-fav-button');
let dropdownMenu = document.getElementById('menuDropdown');
let navbarDropdown = document.getElementById('dropdownMenuLink');
let searchButton = document.getElementById('search-button');


searchButton.addEventListener('click', event => {
    event.preventDefault();
    let input = document.getElementById('search-field');
    console.log(input.value);
    input.setAttribute('value',input.value)
    input.setAttribute('name','param');
    let form = document.getElementById('search-form');
    form.submit();
});


dropdownMenu.addEventListener('click', event => {
    event.preventDefault();
    navbarDropdown.innerText = (event.target.innerText);
    let category =  navbarDropdown.innerText;

    let input = document.getElementById('search-field');
    input.setAttribute('value',category)
    input.setAttribute('name','category');

    let typeReq = document.createElement('input');
    typeReq.setAttribute('value','FILTER')
    typeReq.setAttribute('name','typeReq');
    typeReq.setAttribute('type', 'hidden');

    let form = document.getElementById('search-form');
    form.appendChild(typeReq);
    form.submit();
});

for (let btn of followBtn) {
    btn.addEventListener('click', event => {
        event.preventDefault();
        let btn = event.target;
        let authAttr = btn.getAttribute('auth');
        if(authAttr === 'false') {
            alert('Please, you need log in or sign up')
        } else {
            let podcastID = btn.getAttribute('podcastID');

            let inputID = document.createElement('input');
            inputID.setAttribute('name', 'podcastID');
            inputID.setAttribute('type', 'hidden');
            inputID.setAttribute('value',podcastID);

            let typeReq = document.createElement('input');
            typeReq.setAttribute('value', 'FOLLOW');
            typeReq.setAttribute('name', 'typeReq');
            typeReq.setAttribute('type', 'hidden');

            let form = document.getElementById(podcastID);
            form.appendChild(inputID);
            form.appendChild(typeReq);
            form.submit();
        }
    })
}

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
