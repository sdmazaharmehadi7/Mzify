

console.log("lets write js");
let currentSong=new Audio()

function sec_to_min_conveter(seconds){
    if(isNaN(seconds) || seconds<0){
        return "invalid input"
    }
    const minutes=Math.floor(seconds/60)
    const remaining_minutes=Math.floor(seconds%60)
    const FM=String(minutes).padStart(2,'0')
    const FS=String(remaining_minutes).padStart(2,'0')
    return `${FM}:${FS}`
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

function playMusic(track){
    // let audio=new Audio("/songs/"+track)
    currentSong.src="/songs/"+track
    currentSong.play() 
    play.src="assets/pause.svg"
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}


async function main() {
    let songs = await getSongs()
   

    let songsul = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsul.innerHTML = songsul.innerHTML + `
        <li>
                            <img class="invert" src="assets/music.svg" alt="">

                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>

                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="assets/play.svg" alt="">
                            </div>
        </li>
        `
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="assets/pause.svg"
        }else{
            currentSong.pause()
            play.src="assets/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${sec_to_min_conveter(currentSong.currentTime)}/${sec_to_min_conveter(currentSong.duration)}`
    })


}


main()