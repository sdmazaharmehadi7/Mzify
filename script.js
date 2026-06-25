console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs = [];
let currAlbum;
let albums = [];
 
// ============================================================
// HELPERS
// ============================================================
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
 
// ============================================================
// LOAD SONGS INTO SIDEBAR
// ============================================================
function getSongs(album) {
    currAlbum = album;
    songs = album.songs;
 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
 
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" width="34" src="assets/music.svg" alt="">
                <div class="info">
                    <div>${song.name}</div>
                    <div>Maz</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="assets/play.svg" alt="">
                </div>
            </li>`;
    }
 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, i) => {
        e.addEventListener("click", () => {
            playMusic(songs[i]);
        });
    });
 
    return songs;
}
 
// ============================================================
// PLAY A TRACK
// ============================================================
const playMusic = (song, pause = false) => {
    currentSong.src = song.url;
    if (!pause) {
        currentSong.play();
        play.src = "assets/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = song.name;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
 
// ============================================================
// DISPLAY ALBUM CARDS
// ============================================================
function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
 
    albums.forEach((album) => {
        cardContainer.innerHTML += `
            <div data-folder="${album.folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                </div>
                <img src="${album.cover}" alt="${album.title}">
                <h2>${album.title}</h2>
                <p>${album.description}</p>
            </div>`;
    });
 
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        card.addEventListener("click", () => {
            const album = albums.find(a => a.folder === card.dataset.folder);
            getSongs(album);
            playMusic(album.songs[0]);
        });
    });
}
 
// ============================================================
// MAIN
// ============================================================
async function main() {
 
    // Fetch albums from albums.json
    const response = await fetch('/albums.json');
    const data = await response.json();
    albums = data.albums;
 
    // Load first album by default
    getSongs(albums[0]);
    playMusic(albums[0].songs[0], true);
 
    // Display all album cards
    displayAlbums();
 
    // Play / Pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/pause.svg";
        } else {
            currentSong.pause();
            play.src = "assets/play.svg";
        }
    });
 
    // Time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
 
    // Seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
 
    // Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
 
    // Close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
 
    // Previous
    previous.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.findIndex(s => s.url === currentSong.src);
        if (index - 1 >= 0) playMusic(songs[index - 1]);
    });
 
    // Next
    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.findIndex(s => s.url === currentSong.src);
        if (index + 1 < songs.length) playMusic(songs[index + 1]);
    });
 
    // Volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src =
                document.querySelector(".volume>img").src.replace("assets/mute.svg", "assets/volume.svg");
        }
    });
 
    // Mute toggle
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("assets/volume.svg")) {
            e.target.src = e.target.src.replace("assets/volume.svg", "assets/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("assets/mute.svg", "assets/volume.svg");
            currentSong.volume = 0.50;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    });
}
 
main();