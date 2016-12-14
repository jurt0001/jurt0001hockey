"use strict";


if( document.deviceready){
        	document.addEventListener('deviceready', onDeviceReady, false);
		}else{
        	document.addEventListener('DOMContentLoaded', onDeviceReady, false);
		}

document.getElementById("button1").addEventListener("click", refresh);

let pages = [];
let links = []; 

function onDeviceReady() {
   pages = document.querySelectorAll('[data-role="page"]');
   links = document.querySelectorAll('[data-role="nav"] a');
     
    for(let i=0; i<links.length; i++) {
        links[i].addEventListener("click", navigate);
    }

    if(!localStorage.getItem("jurt0001")){
      serverData.getJSON();
        console.log("its running serverData.getJSON");
        
    }
    
    else {

        //serverData.getJSON();
        let data = JSON.parse( localStorage.getItem("jurt0001"));
        displayData(data);    //LINE THAT DOESN'T WORK.
        standingsData(data);

//        console.log("there is something in there ya dummy");
//        localStorage.clear();
        
        
    }
    
//    let currentLink = document.getElementById("nav_gameresults");
//    currentLink.setAttribute("active", true);

    
}

function navigate(ev) {
    ev.preventDefault(); 
    
    
    let link = ev.currentTarget; 
    let id = link.href.split("#")[1]; 
    
    history.replaceState({}, "", link.href);
    
    for(let i=0; i<pages.length; i++) {
        if(pages[i].id == id){
             pages[i].classList.add("active");
            
        } else {
            
            pages[i].classList.remove("active");
        }           
    }
}

let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/hockey.php",
    httpRequest: "GET",
    getJSON: function () {
        
        let headers = new Headers();

        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
//        console.dir("headers: " + headers.get("Content-Type"));
//        console.dir("headers: " + headers.get("Accept"));
        
        let options = {
            method: serverData.httpRequest,
            mode: "cors",
            headers: headers
        };
        
        let request = new Request(serverData.url, options);
           
        fetch(request)
            .then(function (response) {

                return response.json();
            })
            .then(function (data) {
            
                setStorage(data);
          
            
            })
            .catch(function (err) {
                alert("Error: " + err.message);
            });
    }

};

function setStorage(data) {
   let j = JSON.stringify(data);
    localStorage.setItem("jurt0001", j);
//    localStorage.clear();
    console.log("Set Storage is working" + j);  
    displayData(data);
    standingsData(data);    
}

function refresh(){
        localStorage.clear(); 
     document.querySelector("#teamStandings tbody").innerHTML = "";
//     document.querySelector("").innerHTML = "";
        serverData.getJSON();
   
        
}



function displayData(data) {
    
    //var myScoreData = JSON.parse(localStorage.getItem("jurt0001"));

//    console.log(myScoreData);
        
    let ul = document.getElementById("results");
    ul.innerHTML = ""; 

    data.scores.forEach(function (value) {            
        
        let date = document.createElement("h3");
        date.textContent = value.date;
        date.className = "date";
   
        let homeTeam = null;
        let awayTeam = null;
        let vs = null;
        let matchUp = null;
        let schedule = "";
        
        ul.appendChild(date);

    schedule = document.createElement("div");
    schedule.className = "schedule";      
        
    value.games.forEach(function(item) {  

//        function getTeamName(teams, id) {                      
//            for (let i = 0; i < teams.length; i++) {
//                if (teams[i].id == id) {
//
//
//                    
//                    return teams[i].name;
//                }      
//            }
//            
//        }
        
        
        
        
        


        let aT = teamNames(data.teams, item.away);
        let hT = teamNames(data.teams, item.home); 
            
        matchUp = document.createElement("div");
        matchUp.className = "matchUp";
              
        awayTeam = document.createElement("div"); //DIV AWAY TEAM
        awayTeam.textContent += aT;
              
        vs = document.createElement("div");
        vs.className = "vs";
        vs.textContent = " VS ";      
              
        homeTeam = document.createElement("div");  
        homeTeam.textContent += hT;
        

        let tdn = document.createElement("td");
        var hName = tdn.innerHTML = hT;
        var aName = tdn.innerHTML = aT;
        
        var homeNoSpace = hName.split(" ").join("_"); 
        var awayNoSpace = aName.split(" ").join("_"); 
             
    var svg = document.querySelector("section.template svg");
        
        var homeSvg = svg.cloneNode(true); 
        var awaySvg = svg.cloneNode(true); 
        
        let homeLogo = document.createElement("div"); //creating the icons element inside my table cell
        homeLogo.id = "icons";
        homeLogo.className = homeNoSpace;
        homeLogo.classList.add("homeIcon");
        
        let awayLogo = document.createElement("div");
        awayLogo.id = "icons";
        awayLogo.className = awayNoSpace;
        awayLogo.classList.add("awayIcon");
        
        ul.appendChild(schedule);
        schedule.appendChild(matchUp);
        matchUp.appendChild(awayLogo); 
        awayLogo.appendChild(awaySvg);
        awayLogo.appendChild(awayTeam);
        matchUp.appendChild(vs); 
        matchUp.appendChild(homeLogo);
        homeLogo.appendChild(homeTeam); 
        homeLogo.appendChild(homeSvg);
          
              
                    });

                               })
}
                               
function standingsData(data) {
   let tbody = document.querySelector("#teamStandings tbody");
  
        
    let scores = data.scores; 
    let teams = data.teams;
    
    //let scoresId = scores[0].games;
    
    let stats = [];
    
//      console.log(teams);
    
    teams.forEach(function (value){
           var team = {
            teamId: value.id, 
            teamName: teamNames(teams, value.id),
               wins: 0,
               losses: 0,
               ties: 0,
               pts: 0
               
           }
           
           stats.push(team);

       });

    for (let i=0; i < data.scores.length; i++){
//        console.log("there is this many days");
      
        
    for (let g=0; g < data.scores[g].games.length; g++){

        let homeScore = data.scores[i].games[g].home_score;
        let awayScore = data.scores[i].games[g].away_score;
        let homeTeam = data.scores[i].games[g].home;
        let awayTeam = data.scores[i].games[g].away;
          
  
        if(homeScore > awayScore) {
            for (var x = 0; x < stats.length; x++){ 
                if (homeTeam == stats[x].teamId){ 
                    stats[x].wins++; 
                    stats[x].pts += 2; 
                }
                if (awayTeam == stats[x].teamId){ 
                    stats[x].losses += 1; 
                }
            }    
        }
        
         if(awayScore > homeScore) {
            for (var x = 0; x < stats.length; x++){ 
                if (awayTeam == stats[x].teamId){ 
                    stats[x].wins++; 
                    stats[x].pts += 2;  
                }
                if (homeTeam == stats[x].teamId){ 
                    stats[x].losses += 1; 
                }
            }    
        }
        
        if(awayScore == homeScore) {
            for (var x = 0; x < stats.length; x++){ 
                if (homeTeam == stats[x].teamId){ 
                    stats[x].pts += 1; 
                    stats[x].ties += 1; 
                }
                if (awayTeam == stats[x].teamId){ 
                    stats[x].pts += 1;  
                    stats[x].ties += 1; 
                }
            }    
        }
        
         
    }

    }
    stats.sort(function(a, b){
        var result = (a["wins"]< b.wins) ? -1 : (a.wins > b.wins) ? 1 : ( (a.ties< b.ties)? -1: 1 );
        return result;
    });
    

    stats.forEach(function(value){
     
        let tr = document.createElement("tr");
        let tdn = document.createElement("td"); //creating a table cell
        
       //appending SVG $ team name********************************************
        
        
        var tName = value.teamName; //printing the team name into the table
        
//        tdn.textContent = tName;
        
        var teamNoSpace = tName.split(" ").join("_");
        
        
        var svg = document.querySelector("section.template svg"); //locating my orginal SVG element
        
        
        var homeSvg = svg.cloneNode(true); //Cloning my SVG
        
        
        let logo = document.createElement("div"); //creating the icons element inside my table cell
        logo.id = "icons";
        let tText = document.createElement("div");
        let masterDiv = document.createElement("div");
        masterDiv.id = "master";
        
        tText.textContent = tName
        logo.className = teamNoSpace;
        logo.classList.add("tableLogo");
        
        logo.appendChild(homeSvg);
//        logo.innerHTML = tName;
        tdn.id = "tdnCell";
        
        masterDiv.appendChild(tText);
        masterDiv.appendChild(logo);
        
        tdn.appendChild(masterDiv);
        
   
        let tdw = document.createElement("td");
        tdw.textContent = value.wins;
        let tdl = document.createElement("td"); 
        tdl.textContent = value.losses;
        let tdt = document.createElement("td");
        tdt.textContent = value.ties;
        let tdp = document.createElement("td");
      
        
        tdp.innerHTML = value.pts;
  
  tr.appendChild(tdn);
  tr.appendChild(tdw);
  tr.appendChild(tdl);
  tr.appendChild(tdt);
  tr.appendChild(tdp);
  tbody.appendChild(tr);     
    });

}



//LET GET SOME TEAM NAMES

function teamNames(teams, id) {                      
            for (let i = 0; i < teams.length; i++) {
                if (teams[i].id == id) {
                    
                    return teams[i].name;
                }      
            }
            
        } 





