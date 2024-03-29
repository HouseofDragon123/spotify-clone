console.log("lets write javascript")
let currentsong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder){
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let rn = await a.text();
    // console.log(rn)
    let div = document.createElement("div")
    div.innerHTML = rn
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3"))
        {
           {songs.push(element.href.split(`/${folder}/`)[1]);}
        }
    }
    //show all the songs in the playlist.
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML="";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
        <img class = "invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
            <div>Song artist</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
        
    </li>`;
    let p = Array.from(document.querySelector(".songlist").getElementsByTagName("li"))
    p.forEach(e=>{
      e.addEventListener("click",element=>{
     playmusic(e.querySelector(".info").firstElementChild.innerHTML);
      })
      
    })
    }}

const playmusic = (track,pause=false)=>{
    currentsong.src=`/${currfolder}/` + track;
    if(!pause){
    currentsong.play();
    document.getElementById("play").src="pause.svg";
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00/00:00";
}



async function displayalbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let rn = await a.text();
    // console.log(rn)
    let div = document.createElement("div")
    div.innerHTML = rn
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

    if(e.href.includes("/songs/")){
        let folder = e.href.split("/").slice(-2)[1]
        console.log(folder)

        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="cs" class="card">
            <div class="play">
            <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="24" fill="#00FF00" />
            <g transform="translate(12, 12)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </g>
          </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
    }       
    }   
}



async function main(){
    
    //get the list of all songs.
    await getsongs("songs/ncs")
    playmusic(songs[0],true)

    //display all the albums in the page.
    displayalbums();
    
    // let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songul.innerHTML = songul.innerHTML + `<li>
    //     <img class = "invert" src="music.svg" alt="">
    //     <div class="info">
    //         <div>${song.replaceAll("%20"," ")}</div>
    //         <div>Song artist</div>
    //     </div>
    //     <div class="playnow">
    //         <span>Play Now</span>
    //         <img class="invert" src="play.svg" alt="">
    //     </div>
        
    // </li>`;
    // }

    // //play the first song.
    // var audio = new Audio(songs[0]);
    // audio.play();
    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration,audio.currentSrc,audio.currentTime)
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    //   });
    //attach an event listner to each song
    // let p = Array.from(document.querySelector(".songlist").getElementsByTagName("li"))
    // p.forEach(e=>{
    //   e.addEventListener("click",element=>{
    //  playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    //   })
      
    // })
    //attach an event listner to next,play and previous;
    document.getElementById("play").addEventListener("click",element=>{
       if(currentsong.paused)
       {
        currentsong.play();
        document.getElementById("play").src = "pause.svg"
       }
       else{
        currentsong.pause();
        document.getElementById("play").src = "play.svg"
       }
    })
    //listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })
    //add an eventlistner to seekbar.
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;
    })
    //add eventlistner to our hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })
    //add eventlistner to close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-130%";
    })
    //add eventlistner to prev and next
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    }) 
    //add an eventlistner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
           console.log(e.target.value);
           currentsong.volume = parseInt(e.target.value)/100;
    })
    //load the playlist when the card is clicked.
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}
main();
//<li></li>

