var timer1;
var timer2;
var selectedItem = null;
const redTime = 50;
var songList;
var tempoIndex = 0;

window.onload = function() {
    console.log("Window loaded")
    getSongList()
        .then(createDocument);
}


getSongList = function() {
    const url='/getSongs';
    return makeRequest('GET', url)
        .then(list => {
          songList = JSON.parse(list);
          return songList
        })
}

createDocument = function(songList) {
  this.bipArray = [];

  for(var i=0; i<4; i++) {
      this.bipArray.push(document.getElementById("bipper" + i))
  }
  console.log('biparray', this.bipArray)
  songList.forEach(function(song) {
    this.createSong(song);
  })

  this.createAddSongButton();
}

createAddSongButton = function() {
  var list = document.getElementById("song-list");
  var popup = document.getElementById("songPopup");
  var closePopup = document.getElementById("closePopup");

  var addSongButton = document.createElement("li");
  addSongButton.className = "song";
  addSongButton.innerText = "New song";
  addSongButton.id = "newSong";

  addSongButton.addEventListener("click", () => {popup.style.visibility = "visible"});
  closePopup.addEventListener("click", () => {popup.style.visibility = "hidden"});

  list.appendChild(addSongButton);
}

createSong = function(song) {
  var list = document.getElementById("song-list");
  var item = document.createElement("li");

  item.className = "song";
  item.id = song.id;
  var songButton = document.createElement("div")
  songButton.innerText = song.title;

 /*  var deleteButton = document.createElement("span");
  deleteButton.className = "deleteButton";
  deleteButton.innerText = "X"; */

  songButton.addEventListener("click", () => this.selectSong(song, item));
  //deleteButton.addEventListener("click", () => this.deleteSong(song, item));

  item.appendChild(songButton);
  //item.appendChild(deleteButton);
  list.appendChild(item);
}

selectSong = function(song, item) {
    item.classList.toggle("selected");
    if(this.selectedItem) {
        this.selectedItem.classList.toggle("selected");
    }
    this.selectedItem = item;
    this.playTempo(song.tempo);
}

deleteSong = function(song) {
   makeRequest("POST", "/deleteSong/" + parseInt(song.id))
}

playTempo = function(tempo) {
    var blinkTime = (60000/tempo);

    clearInterval(timer1);
    this.bipArray.forEach(el => {
        el.classList.remove("bipped");
    })
    this.bipArray[0].classList.toggle("bipped")
    this.bipBlink(blinkTime);
}

bipBlink = function(blinkTime) {
    var index = 0;

    timer1 = setInterval(() => {
        this.bipArray[index].classList.toggle("bipped")
        if (index === 3) {
            index = 0;
        } else {
            index++;
        }
        // this.tempoIndex = this.tempoIndex === 4 ? 0 : this.tempoIndex++;
        this.bipArray[index].classList.toggle("bipped")
        console.log(index)
    }, blinkTime)
}

function makeRequest (method, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 304) {
          console.log("ffff", xhr.response)
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }





