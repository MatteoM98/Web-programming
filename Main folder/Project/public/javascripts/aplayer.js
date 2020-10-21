let elements = document.querySelectorAll('main .play-btn');
for (const elem of elements) {
    elem.addEventListener('click', event => {
        event.preventDefault();
        let urlMusic = event.target.getAttribute('episode-audio');
        let urlImage = event.target.getAttribute('podcast-image');
        let episodeTitle = event.target.getAttribute('episode-title');
        let podcastTitle = event.target.getAttribute('podcast-title');
        const ap = new APlayer({
            container: document.getElementById('aplayer'),
            audio: [{
                name: episodeTitle,
                artist: podcastTitle,
                url: '/audio/' + urlMusic,
                cover: '/images/' + urlImage
            }]
        });
        ap.play();
        event.stopPropagation();
    });
}

