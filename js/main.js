let main = document.getElementById("main");
let home = document.getElementById("home");
let content = document.getElementById("content");

let buttons = ["about", "blog", "portfolio"];
let active = null;

let vh = function (v) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

let clearNav = function () {
  for (let i = 0; i < buttons.length; i++) {
    if (document.getElementById("nav").children[i].children[0].classList.contains("active")) {
      document.getElementById("nav").children[i].children[0].classList.remove("active");
      content.children[i].style.opacity = "0"
      setTimeout(() => {
        content.children[i].classList.add("hidden");
      }, 300);
    }
  }
  active = null;
}

let recenter = function () {
  if (!!active) {
    content.style.height = `600px`;
    content.style.padding = "20px 10px"
  } else {
    content.style.height = `0`
    content.style.padding = "0px 10px"
  }
  let mainHeight = !!active ? 900 : 217; //TODO: make default value adjustable
  let margin = Math.max(0, vh(50) - mainHeight / 2)
  main.style.top = `${margin}px`
}

let reset = function (delay) {
  clearNav();
  setTimeout(recenter, delay);
}

let makeActive = function (section) {
  wasActive = !!active
  active = section
  document.getElementById(section).classList.remove("hidden")
  document.getElementById(section + "-link").classList.add("active")
  if (!wasActive) {
    setTimeout(recenter, 10);
  }
  setTimeout(() => {
    document.getElementById(section).style.opacity = "1.0"
  }, 200);
}

window.addEventListener("resize", recenter);

document.addEventListener("DOMContentLoaded", function (event) {
  main = document.getElementById("main");
  home = document.getElementById("home");
  content = document.getElementById("content");

  home.addEventListener("click", function (event) {
    reset(300);
  });

  for (let i = 0; i < buttons.length; i++) {
    document.getElementById(buttons[i] + "-link").addEventListener("click", function (event) {
      let fadeTimeout = 0
      if (active) {
        if (active === buttons[i]) {
          return
        }
        clearNav();
        fadeTimeout = 300
      }
      setTimeout(() => {
        makeActive(buttons[i]);
      }, fadeTimeout);
    });
  }

  reset(0);
});