class Serververwaltung {
  constructor() {
    this.spielerVerwaltungen = []; 
    this.raumnamen = [];
  }
  
  raumerstellen(raumid,name,id) {
    var tempo = new Spielerverwaltung(raumid,id);
    var trutu = new Spieler(name,id);
    tempo.spielerHinzufuegen(trutu);
    
    this.spielerVerwaltungen.push(tempo);
    this.raumnamen.push(raumid);
  }
  
  spielerRaumHinzufuegen(raum, spieler) {
    
    var room = raum;
    if(this.raumnamen){
    for(let i = 0; i < this.raumnamen.length; i++) {
      
      if(this.raumnamen[i] == room) { 
        
        this.spielerVerwaltungen[i].spielerHinzufuegen(spieler);
        return this.spielerVerwaltungen[i].gibhostid();
        
        }
      }
    }
  }

  starteSpielRaum(raum) {
    var room = raum;
    var array = [];
    if(this.raumnamen) {
    for(let i = 0; i < this.raumnamen.length; i++) { 
      
      if(this.raumnamen[i] == room) { 
        
        
        array = this.spielerVerwaltungen[i].gibSpieler();
      }
    }
    }else {
      console.log("irgendwas its im arsch")
    }

    var returnarray = [];
    
    for(let i = 0; i < array.length; i++) {
      returnarray[i] = array[i].gibId();
    }
    return returnarray;
  }

  gibSpielverwaltungen() {
    return this.spielerVerwaltungen;
  }

  gibRaumnamen() {
    return this.raumnamen;
  }
  
}

class Spieler {
  constructor(name,iid) {
    this.name = name;
    this.punktzahl = 10;
    this.tot = false;
    this.Spielzahlen = [];
    this.id = iid;
  }

  erhöhePunktzahl(punkte) {
    if(punkte<0) throw "Error";
    this.punktzahl += punkte;
  }


  gibPunktzahl() {
    return this.punktzahl;
  }

  gibName() {
    return this.name;
  }
  
  gibId() {
    return this.id;
  }

  gibSpielzahlen() {
    return this.Spielzahlen;
  }

  gibSpielzahlenIn(i) {
    return this.Spielzahlen[i-1];
  }
  
  gibZahlab(zahl) {
    this.Spielzahlen.push(zahl);
  }

  subtrahierePunktzahl() {
    this.punktzahl = this.punktzahl-1;
    if(this.punktzahl < 1) {
       this.tot = true;
    }
  }
  nochAmLeben() {
    return !this.tot;
  }
}




// Spielerverwaltungsklasse
class Spielerverwaltung {
  constructor(raumid,hostide) {
    this.spielerliste = [];
    this.anzahlspieler = 0;
    this.runde = 1;
    this.spielerzahl = 0;
    this.roomId = raumid;
    this.hostid = hostide;
    this.lergebnis = 0;
    
    
  }
  
  gibSpieler() {
    return this.spielerliste;
  }
  
  gibraumname() {
    return this.roomId;
  }

  gibrunde() {
    return this.runde;
  }

  gibhostid() {
    return this.hostid;
  }



  alleAbgegeben() {
    
    var cnt = 0;
    var cnta = 0;
    for(let i =0; i< this.spielerliste.length; i++) {
      if(this.spielerliste[i].nochAmLeben()) {
        cnt++;
      }    
    }

    for(let i =0; i< this.spielerliste.length; i++) {
      if(this.spielerliste[i].nochAmLeben()) {
        var obj = this.spielerliste[i].gibSpielzahlenIn(this.runde);
        if (obj !== undefined && obj !== null) {
          cnta++;
        }
      }    
    }
    if(cnt == cnta) {
      this.spielAnfangen();
    }
  }
  

  
  spielerHinzufuegen(spieler) {
    this.spielerzahl = this.spielerzahl + 1;
    this.spielerliste.push(spieler);
  }
  
  spielAnfangen() {
    for(let i = 0; i< this.spielerliste.length; i++) {
        if(this.spielerliste[i].nochAmLeben() == false){
          var tid = this.spielerliste[i].gibId();
          io.to(tid).emit("Ausgeschieden");
        }
      }      
      this.starteSpielrunde();
    
  }


 

  
 starteSpielrunde() {
    
    var gewinner = this.ergebnisBerechnen();
    for(let i = 0; i<this.spielerliste.length ; i++) {
      if(this.spielerliste[i].nochAmLeben()) {
        if(this.spielerliste[i].gibId() !== gewinner.gibId()) {
          this.spielerliste[i].subtrahierePunktzahl();
          if(this.spielerliste[i].nochAmLeben() == false){
            this.anzahlspieler = this.anzahlspieler-1;
            }
          }
        }
      } 
    
    this.ergebnisSenden(gewinner.gibName());
    this.runde = this.runde + 1;
    }
  
  

  ergebnisBerechnen() {
    var tgewi = 0;
    var zwerg = 0
    var tuarray = [];
    for(let i = 0; i< this.spielerliste.length;i++) {
      if(this.spielerliste[i].nochAmLeben()) {
         tuarray.push(this.spielerliste[i].gibSpielzahlenIn(this.runde));
        tgewi = this.spielerliste[i].gibName();
        }
      }
     var divi = tuarray.length;
    if(divi < 2) {
      for(let k = 0; k < this.spielerliste.length ; k++) {
        var idi =  this.spielerliste[k].gibId();
        io.to(idi).emit("gewonnenHat", tgewi);
      }
    }
    
  
    


    
    let sum = 0;

    for (let i = 0; i < tuarray.length; i++) {
      sum += tuarray[i];
    }
    var divi = tuarray.length;
    zwerg = sum / divi;
    zwerg = zwerg * 0.8;
    this.lergebnis = zwerg;
    var diff = 110;
    var probw = null;
    for(let i = 0; i<this.spielerliste.length;i++) {
      if(this.spielerliste[i].nochAmLeben()) { 
        var tem = Math.abs(zwerg - this.spielerliste[i].gibSpielzahlenIn(this.runde));
        if( tem < diff){
          probw = this.spielerliste[i];
          diff = tem;
          
        }
      }
    }
    if(probw == null) {
      probw = this.spielerliste[0];
      console.log("erorr gewinner == null");
    }
    console.log(probw.gibName());
    return probw;
  }

  ergebnisSenden(gewinner) {
    for(let k = 0; k < this.spielerliste.length ; k++) {

      var id = this.spielerliste[k].gibId();
      var pktarray = [];
      ;
      io.to(id).emit("Gewinnerist", gewinner);
      io.to(id).emit("Ergebnisist", this.lergebnis);

        for(let j = 0; j < this.spielerliste.length ; j++) {
          var kname = this.spielerliste[j].gibName();
          var pktzhl = this.spielerliste[j].gibPunktzahl();
          var erge = this.spielerliste[j].gibSpielzahlenIn(this.runde);

          pktarray.push(kname);
          pktarray.push(pktzhl);
          pktarray.push(erge);
          pktarray.push("");
        }
          
        io.to(id).emit("Punktzahlen", pktarray);
        
        if(this.spielerliste[k].nochAmLeben()) {
          io.to(id).emit("showButton")
          
        }
      }
    }    
  }








const svw = new Serververwaltung();
//svw.raumerstellen("Debug Raum","suusybkaka","123456zhjfkf");

/*var debugtest = svw.gibSpielverwaltungen();
var debugtesti = debugtest[0];
console.log(debugtesti);
*/







const express = require("express"); // use express
const { isNullOrUndefined } = require("util");
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server); // create instance of socketio
app.use(express.static("public")); // use "public" directory for static files
io.on("connection", socket => {
  
  socket.on("newRoom", (name, roomName) => { 
    var id = socket.id;
    var arr = svw.gibRaumnamen();
    if (arr.indexOf(roomName) !== -1) {
      io.to(id).emit("RoomNameAlready"); 
      console.log("a");
    } else {
      
      io.to(id).emit("newRoomConfirmed", name.toString(), roomName.toString()); 
      svw.raumerstellen(roomName,name,id);
      io.to(id).emit("newRoomdone", roomName, name);
      
    }
    
    
    
    
    
  });

  socket.on("alleRaume",() =>{
    
    var id = socket.id;
    var array = svw.gibRaumnamen();
    io.to(id).emit("alleRaume", array);
    
  });


  

  socket.on("joinRoom", (raumname, name, id) => {
    var idd = id;
    
    
    var tempplayer = new Spieler(name,idd);
    var hostid = svw.spielerRaumHinzufuegen(raumname,tempplayer);
    
    io.to(idd).emit("raumGejoint");
    io.to(hostid).emit("PlayerJoinedRoom", name);

    
  });

  socket.on("startGame", (raumname) => {
    var array = svw.starteSpielRaum(raumname);
    for(let i = 0; i < array.length; i++) {
      var raume = svw.gibSpielverwaltungen();
      var arr = [];
      var tarr = [];
      for( let j = 0;j < raume.length; j++) {
        if(raume[j].gibraumname() == raumname) {
          arr = raume[j].gibSpieler();
          for(let h = 0; h< arr.length;h++) {
            tarr.push(arr[h].gibName());
          }
          
        }
      }
      io.to(array[i]).emit("spielGestartet", tarr);
    }
  });

  socket.on("GameInput", (input, raum, id) => {
    console.log(input, raum, id);

    
    let finput = input.replace(/\D/g, "");
    
    var array = svw.gibSpielverwaltungen();
    var tarray = [];
    var tplayer = [];
    for(let i = 0; i < array.length; i++) {
      tarray[i] = array[i].gibraumname();
      if(tarray[i] == raum) {
        tplayer = array[i].gibSpieler();
      
        for(let j = 0; j < tplayer.length; j++) {
          if(tplayer[j].gibId() == id) {
            if(tplayer[j].nochAmLeben()) {
                
              var tipp = parseInt(finput, 10)
              if(tipp > 100) {
                tipp = 100;
              }
              if(tipp < 0) {
                tipp = 0;
              }
              tplayer[j].gibZahlab(tipp);

              array[i].alleAbgegeben();
                
              
            }
          }
        }
      }
    }
  });
  
  
});
server.listen(3000); // run server








//code der zum debuggen genutzt wurde folgt 


/*socket.on("joinRooma",() =>{
    
    var id = socket.id;

    var array = svw.gibSpielverwaltungen();

    for(let i = 0 ; i < array.length ; i++) {
    array[i] = array[i].gibrn();
    }
    
    
    io.to(id).emit("alleRaume", array);
  });*/
    /*var array = svw.gibSpielverwaltungen();

    for(let i = 0 ; i < array.length ; i++) {
      array[i] = array[i].gibrn();
      if(array[i] == raumname) {
        console.log("ichhabs");
      }
    }
    

    
    var debugtest = svw.gibSpielverwaltungen();
    var debugtesti = debugtest[0];
    console.log(debugtesti);

    for(let i = 0 ; i < debugtest.length ; i++) {
      var debugtesto = debugtest[i];
      console.log(debugtesto);
    }


    
    for(let i = 0 ; i < debugtest.length ; i++) {
      var tempu = debugtest[i];
      console.log(tempu);
      var triti = tempu.gibrn();
      console.log("bruh");
      if(triti == raumname) {
        tempar[i].spielerHinzufuegen(tempplayer);
        
        console.log("debugserver10");
      }
    }

    */