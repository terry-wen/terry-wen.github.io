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
      snapshot.val().forEach((p) => {
        players[p.id] = p;
      })
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
    
          for (var i = 1; i <= 10; i++) {
            if (scores[i] === undefined) {
              continue;
            }
            var content = `<div class="score-col">`
            content += `<h2 class="score-row score-row-top"><span class="rank anchor">#</span><b>Name</b><span><b>Score</b></span></h2>`
            scores[i]?.sort((a, b) => {
              return b.score - a.score;
            })
            scores[i]?.forEach((s, i) => {
              if (!!s.player) {
                var tag = i%2;
                if (i == 0) {
                  teamTotals[players[s.player].team].gold += 1;
                  players[s.player].gold = (players[s.player].gold ? players[s.player].gold : 0) + 1
                  tag = "gold"
                } else if (i == 1) {
                  teamTotals[players[s.player].team].silver += 1;
                  players[s.player].silver = (players[s.player].silver ? players[s.player].silver : 0) + 1
                  tag = "silver"
                } else if (i == 2) {
                  teamTotals[players[s.player].team].bronze += 1;
                  players[s.player].bronze = (players[s.player].bronze ? players[s.player].bronze : 0) + 1
                  tag = "bronze"
                }
                content += `<h2 class="score-row score-row-${tag}"><span class="rank anchor">${i+1}</span>${players[s.player].name}<span>${s.score}</span></h2>`
              } else {
                teamTotals[s.winner].total += 1
              }
            })
            content += "</div>"
            $(`#scoreboard-${i}`).html(content);
          }
          for (var i = 1; i < 2; i++) {
            $(`#team-${i}-total`).text(teamTotals[i].total)
            $(`#team-${i}-gold`).text(teamTotals[i].gold)
            $(`#team-${i}-silver`).text(teamTotals[i].silver)
            $(`#team-${i}-bronze`).text(teamTotals[i].bronze)
          }
          var playerArray = Object.values(players)
          if (!!playerArray) {
            playerArray.sort((a, b) => {
              if (a.gold != b.gold) {
                return b.gold - a.gold 
              }
              if (a.silver != b.silver) {
                return b.silver = a.silver
              }
              return b.bronze - a.bronze
            })
            var content = `<div class="score-col">`
            content += `<h2 class="score-row score-row-top"><span class="rank anchor">#</span><b>Name</b><span><span class="medals anchor"><img src="images/gold.png" alt="gold"/></span><span class="medals anchor"><img src="images/silver.webp" alt="silver"/></span><span class="medals anchor"><img src="images/bronze.webp" alt="bronze anchor"/></span></span></h2>`
            playerArray.forEach((p) => {
              content += `<h2 class="score-row score-row-${i%2}"><span class="rank anchor">${i+1}</span>${p.name}<span><span class="medals anchor">${p.gol || 0}</span><span class="medals anchor">${p.silver || 0}</span><span class="medals anchor">${p.bronze || 0}</span></span></h2>`
            })
            content += "</div>"
            $(`#scoreboard-${11}`).html(content);
          }
        } else {
          console.log("No data available");
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