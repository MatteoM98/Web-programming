let elements = document.querySelectorAll('main .play-btn');
for (const elem of elements) {
    elem.addEventListener('click', event => {
        event.preventDefault();
        let btn = event.target;
        let auth = btn.getAttribute('auth');
        let hasCC = btn.getAttribute('hasCC');
        if(auth === 'false') {
            //not authenticated
            let price = parseFloat(btn.getAttribute('price'));
            if(price>0) {
                alert('Sorry, you must log in and register a credit card to listen this episode');
                event.stopPropagation();
            }   else {
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
            }         
        } else {
            //is authenticated
            //if isFree => puoi riprodurlo
            let price = parseFloat(btn.getAttribute('price'));
            if(price == 0 || hasCC === 'true') {
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
            } else {
            //else registra una carta di credito sul tuo profilo
                alert('Registra una CC dal tuo profilo');
                event.stopPropagation();
            }
        }
    });
}

