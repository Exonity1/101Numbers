var roomid = 0;
var name = 0;
var runde = 1;
var allplayers = [];
const socket = io(); 


function hideStart() {
  document.getElementById("container-wrapper").style.scale = "0";
}

function showStart() {
  document.getElementById("container-wrapper").style.scale = "1";
}

function hideRoomList() {
  document.getElementById("roomList").style.scale = "0";
}

function showRoomList() {
  document.getElementById("roomList").style.scale = "1";
}

function hideMeldung() {
  document.getElementById("meldung").style.scale = "0";
}

function showMeldung(text) {
  document.getElementById("meldung").style.scale = "1";
  document.getElementById("meldung").innerText=text;
}

function hideRoomMenue() {
  document.getElementById("roomMenue").style.scale = "0";
}

function showRoomMenue() {
  document.getElementById("roomMenue").style.scale = "1";
}

function hideGameUi() {
  document.getElementById("mainGameContainer").style.scale = "0";
}

function showGameUi() {
  document.getElementById("mainGameContainer").style.scale = "1";
}

function hideInputButton() {
  document.getElementById("inputbutton").style.scale = "0";
}

function showInputButton() {
  document.getElementById("inputbutton").style.scale = "1";
}

hideGameUi();
hideRoomMenue();
hideMeldung();
hideRoomList();
showStart();





function addToListe(raum) {
  
  
    var roombox = document.createElement('div');
    roombox.className = 'roombox';

    var textBox = document.createElement('h4');
    textBox.innerText = raum;
    roombox.appendChild(textBox);

    var button = document.createElement('button');
    button.innerText = "Join Room " + raum;
    button.id =raum; 

    button.addEventListener('click', function() {
      
      joinRoom(raum);
    });

  
    roombox.appendChild(button);

    roomList.appendChild(roombox);
}

function joinRoom(raumname) {
    var id = socket.id;
    this.roomid = raumname;
    document.getElementById("mainGameCaption").innerText = raumname;
    socket.emit("joinRoom", raumname, this.name, id);
}


function openRoom() {
  var nameInput = document.getElementById("nameb-input");
  var name = nameInput.value.trim();
  var roomNameInput = document.getElementById("room-input");
  var roomName = roomNameInput.value.trim();
  console.log(roomName);
  console.log(name);
  socket.emit("newRoom", name, roomName);
}

function newPlayer() {
  var nameInput = document.getElementById("namea-input");
  this.name = nameInput.value.trim();
  console.log(this.name);
  socket.emit("newPlayer", (this.name));
  socket.emit("alleRaume");
   
}

function warteAufSpielbeginn() {
  hideRoomList();
  showMeldung("Wait for Host to Start Game...");
  
}

function displayRoom(raum) {
  hideStart();

  var menueBox = document.createElement('div');
    menueBox.className = 'menueBox';

    var textBox = document.createElement('h4');
    textBox.innerText = raum + " Alle Spieler:";
    menueBox.appendChild(textBox);

  var textplayers = document.createElement('p');
    textplayers.innerText = "";
    textplayers.id = "players";
    menueBox.appendChild(textplayers);

    var button = document.createElement('button');
    button.innerText =  "Start Game";
    button.id =raum; 

    button.addEventListener('click', function() {
      
     startGame(raum);
    });

  
    menueBox.appendChild(button);

    roomMenue.appendChild(menueBox);
    showRoomMenue();
}


function addtoRoom(name) {
  var temk = document.getElementById("players").innerText;
  document.getElementById("players").innerText = temk + " " + name +",";
  this.allplayers.push(name);
}


function startGame() {
  socket.emit("startGame", roomid)
  hideRoomMenue();
  showGameUi();
  document.getElementById("mainGameCaption").innerText = this.roomid;
}


function createTable(playerNames) {
  var container = document.getElementById('table-container');
  var table = document.createElement('table');
  table.id = 'game-table';
  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');

  
  var playerNameHeader = document.createElement('th');
  playerNameHeader.textContent = 'Spielername:';
  headerRow.appendChild(playerNameHeader);

  
  for (var i = 0; i < playerNames.length; i++) {
    var playerName = playerNames[i];

    var playerHeader = document.createElement('th');
    playerHeader.textContent = playerName;
    headerRow.appendChild(playerHeader);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  var tbody = document.createElement('tbody');

 
  var scoreRow = document.createElement('tr');
  var scoreHeader = document.createElement('td');
  scoreHeader.textContent = 'Punktzahl:';
  scoreRow.appendChild(scoreHeader);

  
  for (var i = 0; i < playerNames.length; i++) {
    var scoreCell = document.createElement('td');
    scoreCell.textContent = '10';
    scoreRow.appendChild(scoreCell);
  }

  tbody.appendChild(scoreRow);

  
  var resultRow = document.createElement('tr');
  var resultHeader = document.createElement('td');
  resultHeader.textContent = 'Zahl:';
  resultRow.appendChild(resultHeader);

  
  for (var i = 0; i < playerNames.length; i++) {
    var resultCell = document.createElement('td');
    resultRow.appendChild(resultCell);
  }

  tbody.appendChild(resultRow);

  table.appendChild(tbody);
  container.appendChild(table);
}


function getCellText(columnIndex, rowIndex) {
  var table = document.getElementById('game-table');
  var tbody = table.getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');

  var row = rows[rowIndex];
  var cell = row.getElementsByTagName('td')[columnIndex];

  return cell.textContent.trim();
}


function setCellText(columnIndex, rowIndex,text) {
  var table = document.getElementById('game-table');
  var tbody = table.getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');

  var row = rows[rowIndex];
  var cell = row.getElementsByTagName('td')[columnIndex];

  cell.textContent = text;
}



function updateTable(data) {
  var table = document.getElementById('game-table');
  var tbody = table.getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');  
  var plyercnt = data.length/4;
  
  for (var i = 0; i < data.length; i++) {
    if(data[i+3]=="") {
    
      var playerName = data[i];
      var score = data[i+1];
      var result = data[i+2];

      var u = (i+4)/4;
      
        
        
      setCellText(u,0,score);
      //console.log(getCellText(u,0));
      setCellText(u,1,result);
      //console.log(getCellText(u,1));
      
    }
  }
}



function sendGameInput() {
  var id = socket.id;
  var value = document.getElementById("mainGameInput").value;
  console.log(value);
  if(value.toString() == "") {
    value = 0;
  }
  socket.emit("GameInput", value, this.roomid, id);
  console.log(value, this.roomid, id);
}



socket.on("RoomNameAlready", () => {
  alert("A room with the same roomname already exists!");
});

socket.on("newRoomConfirmed", (pname, proomName) => {
  this.name = pname;
  this.roomid = proomName;
});

socket.on("newRoomdone", (raumid, name) => {
  this.roomid = raumid;
  displayRoom(raumid);
  addtoRoom(name);
});

socket.on("PlayerJoinedRoom", (name) =>{
  addtoRoom(name);
});

socket.on("alleRaume", (array) => {
  hideStart();
  for(let i = 0 ; i < array.length ; i++) {
    addToListe(array[i]);
    
  }
  showRoomList();
});

socket.on("raumGejoint", () => {
  warteAufSpielbeginn();
});

socket.on("spielGestartet", (playerarray) => {
  hideMeldung();
  showGameUi();
  createTable(playerarray);
});


socket.on("Gewinnerist", (gname) => {
  document.getElementById("mainGameInput").value = "0";
  var a = "Gewinner ist " + gname + "!";
  document.getElementById("winner").innerText = a;
});


socket.on("showButton", () => {
  showInputButton();
});


socket.on("Ergebnisist", (erg) => {
  
  this.runde = this.runde +1;
  var ergebnis = "Average ⨉ 0.8 = " + erg.toString();
  console.log(ergebnis);
  document.getElementById("result").innerText = ergebnis;
  document.getElementById("mainGameRound").innerText = "Runde: " + this.runde.toString();
});


socket.on("Punktzahlen", (arr) => {
  console.log(arr);
  updateTable(arr);
  console.log(arr);
});

socket.on("Ausgeschieden", () => {
  hideRoomList();
  hideRoomMenue();
  hideStart();
  showMeldung("Game Over");
  
});

socket.on("gewonnenHat", (gname) => {
  var a = "Gewonnen hat " + gname  + "!";
  
  hideGameUi();
  hideRoomList();
  hideRoomMenue();
  hideStart();
  showMeldung(a);
});