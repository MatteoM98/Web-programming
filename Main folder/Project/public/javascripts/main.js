//element
let dropdownMenu = document.getElementById('menuDropdown');
let navbarDropdown = document.getElementById('navbarDropdown');
let signUpButton = document.getElementById('sign-up-button');
let searchButton = document.getElementById('search-button');

//function


//eventListener
dropdownMenu.addEventListener('click', event => {
    navbarDropdown.innerText = (event.target.innerText);
});

signUpButton.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById('form-login').action = '/';
    document.getElementById('form-login').submit();
});


searchButton.addEventListener('click', event => {
    event.preventDefault();
    let form = document.getElementById('search-form');
    let input = document.createElement('input');
    let input2 = document.createElement('input');
    let searchBar = document.getElementById('search-bar');
    let navbarText = navbarDropdown.innerText;
    //set first parameter
    input.setAttribute('name', 'category');
    input.setAttribute('type', 'hidden');
    input.setAttribute('value',navbarText);
    //set second parameter
    input2.setAttribute('name','query');
    input2.setAttribute('type', 'hidden');
    input2.setAttribute('value',searchBar.value);
    if(input2.value !== '' &&  input2.value.trim() !== "") {
        input2.value = input2.value.trim();
        form.appendChild(input);
        form.appendChild(input2);
        form.submit();
    }
});