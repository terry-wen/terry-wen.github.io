// Base doc elements
let main = document.getElementById(`main`);
let home = document.getElementById(`home`);
let content = document.getElementById(`content`);
let nav = document.getElementById(`nav`);

// Section tags
let buttons = [`about`, `blog`, `portfolio`];
let active = null;

// CSS vh simulator
let vh = function (v) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

let clearNav = function () {
  for (let i = 0; i < buttons.length; i++) {
    if (nav.children[i].children[0].classList.contains(`active`)) {
      nav.children[i].children[0].classList.remove(`active`);
      content.children[i].style.opacity = `0`;
      setTimeout(() => {
        content.children[i].classList.add(`hidden`);
      }, 300);
    }
  }
  active = null;
}

let recenter = function () {
  if (!!active) {
    content.style.height = `600px`;
    content.style.padding = `20px 10px`;
  } else {
    content.style.height = `0`;
    content.style.padding = `0px 10px`;
  }
  let mainHeight = !!active ? 900 : 217; //TODO: make default value adjustable
  let top = Math.max(0, vh(50) - mainHeight / 2);
  main.style.top = `${top}px`;
}

let reset = function (delay) {
  clearNav();
  setTimeout(recenter, delay);
}

let makeActive = function (section) {
  let wasActive = !!active;
  active = section;
  document.getElementById(section).classList.remove(`hidden`);
  document.getElementById(section + `-link`).classList.add(`active`);
  if (!wasActive) {
    // recenter content if content was not already active
    setTimeout(recenter, 10);
  }
  setTimeout(() => {
    document.getElementById(section).style.opacity = `1.0`;
  }, 200);
}

window.addEventListener(`resize`, recenter);

document.addEventListener(`DOMContentLoaded`, function (event) {
  main = document.getElementById(`main`);
  home = document.getElementById(`home`);
  content = document.getElementById(`content`);
  nav = document.getElementById(`nav`);

  home.addEventListener(`click`, function (event) {
    reset(300);
  });

  buttons.forEach(section => {
    document.getElementById(`${section}-link`).addEventListener(`click`, function (event) {
      let fadeTimeout = 0
      if (active) {
        if (active === section) {
          return
        }
        clearNav();
        fadeTimeout = 300
      }
      setTimeout(() => {
        makeActive(section);
      }, fadeTimeout);
    });
  });

  reset(0);
});