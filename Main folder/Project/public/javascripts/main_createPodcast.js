let addEpisode = document.getElementById('addEpButton');
let subButton = document.getElementById('submitButton');
let count = 0;


addEpisode.addEventListener('click', event => {
    event.preventDefault();
    let div = document.createElement('div');
    div.className = 'form-group';
    let divEp = document.getElementById('EpisodeN0');
    div.innerHTML = divEp.innerHTML;
    console.log(divEp.innerHTML);
    divEp.insertAdjacentElement('afterend',div);
});