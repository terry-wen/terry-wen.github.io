// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  databaseURL: "https://bb-olympics-2025-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = ref(getDatabase(app));

const teamName = {
  1: "위국",
  2: "<s>tommy</s>",
}

// Get a database reference to our posts
function refresh() {
  $("#refresh").addClass("rotate")

  const players = {};
  const scores = {};
  const teamTotals = {
    1: {
      total: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
    },
    2: {
      total: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
    }
  };
  get(child(db, `players/`)).then((snapshot) => {
    if (snapshot.exists()) {
      for(const [key, value] of Object.entries(snapshot.val())) {
        players[key] = value;
        players[key].gold = 0
        players[key].silver = 0
        players[key].bronze = 0
      }
      console.log(players)
      get(child(db, `scores/`)).then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.val().forEach((s) => {
            if (!!scores[s.game]) {
              scores[s.game].push(s)
            } else {
              scores[s.game] = [s]
            }
          })
          console.log(scores)
    
          for (var g = 1; g <= 10; g++) {
            if (scores[g] === undefined) {
              continue;
            }
            var content = `<div class="score-col">`
            content += `<h2 class="score-row score-row-top"><span class="rank anchor">#</span><b>Name</b><span><b>Score</b></span></h2>`
            scores[g]?.sort((a, b) => {
              return b.score - a.score;
            })
            var lastRank = 0;
            var lastScore = 1000000;
            var teams = {
              1: "0",
              2: "0",
            }
            var winner = 0;
            scores[g]?.forEach((s, i) => {
              if (!!s.player) {
                var tag = i%2;
                if (lastScore > s.score) {
                  lastScore = s.score
                  lastRank++
                }
                if (lastRank == 1) {
                  teamTotals[players[s.player].team].gold += 1;
                  players[s.player].gold = (players[s.player].gold ? players[s.player].gold : 0) + 1
                  tag = "gold"
                } else if (lastRank == 2) {
                  teamTotals[players[s.player].team].silver += 1;
                  players[s.player].silver = (players[s.player].silver ? players[s.player].silver : 0) + 1
                  tag = "silver"
                } else if (lastRank == 3) {
                  teamTotals[players[s.player].team].bronze += 1;
                  players[s.player].bronze = (players[s.player].bronze ? players[s.player].bronze : 0) + 1
                  tag = "bronze"
                }
                content += `<h2 class="score-row score-row-${tag}"><span class="rank anchor">${lastRank}</span>[${teamName[players[s.player].team]}] ${players[s.player].name}<span>${s.score}</span></h2>`
              } else {
                if (!!s.score) { 
                  teams[s.winner] = s.score
                } else {
                  teamTotals[s.winner].total += 1
                  winner = s.winner
                }
              }
            })
            content += "</div>"
            var fullContent = `
							<div class="sched-col scores team-1 ${winner === 1 ? "winner" : ""}">
								<h1>위국</h1>
								<h1 id="team-1-1">${teams[1]}</h1>
								</div>
							<div class="sched-col scores team-2 ${winner === 2 ? "winner" : ""}">
								<h1><s>tommy</s></h1>
								<h1 id="team-2-1">${teams[2]}</h1>
								</div>
            `
            if (g != 4 && g != 9) {
              fullContent += content
            }
            $(`#scoreboard-${g}`).html(fullContent);
          }
          for (var i = 1; i < 2; i++) {
            $(`#team-${i}-total`).text(teamTotals[i].total)
            $(`#team-${i}-gold`).text(teamTotals[i].gold)
            $(`#team-${i}-silver`).text(teamTotals[i].silver)
            $(`#team-${i}-bronze`).text(teamTotals[i].bronze)
          }
        } else {
          console.log("No data available");
        }
        var playerArray = Object.values(players)
        if (!!playerArray) {
          playerArray.sort((a, b) => {
            if (a.gold != b.gold) {
              return b.gold - a.gold 
            }
            if (a.silver != b.silver) {
              return b.silver - a.silver
            }
            if (b.bronze != a.bronze) {
              return b.bronze - a.bronze
            }
            return a.name.localeCompare(b.name)
          })
          console.log(playerArray)
          var content = `<div class="score-col">`
          content += `<h2 class="score-row score-row-top"><span class="rank anchor">#</span><b>Name</b><span><span class="medals anchor"><img src="images/gold.png" alt="gold"/></span><span class="medals anchor"><img src="images/silver.webp" alt="silver"/></span><span class="medals anchor"><img src="images/bronze.webp" alt="bronze anchor"/></span></span></h2>`
          var lastRank = 0;
          var lastScore = 10000;
          playerArray.forEach((p) => {
            var score = p.gold * 100 + p.silver * 10 + p.bronze
            if (score < lastScore) {
              lastScore = score
              lastRank++
            }
            content += `<h2 class="score-row team-${p.team}"><span class="rank anchor">${lastRank}</span>${p.name}<span><span class="medals anchor">${p.gold}</span><span class="medals anchor">${p.silver}</span><span class="medals anchor">${p.bronze}</span></span></h2>`
          })
          content += "</div>"
          $(`#scoreboard-${11}`).html(content);
        }
        $("#refresh").removeClass("rotate")
      }).catch((error) => {
        console.error(error);
        $("#refresh").removeClass("rotate")
      });
    } else {
      console.log("No data available");
      $("#refresh").removeClass("rotate")
    }
  }).catch((error) => {
    console.error(error);
  });
}

$("#refresh").on( "click", function() {
  refresh();
} );

refresh();