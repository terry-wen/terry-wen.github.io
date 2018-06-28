function transitionEndEventName () {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }

    //TODO: throw 'TransitionEnd event is not supported in this browser';
}

document.addEventListener("DOMContentLoaded", function(event) {
  let main = document.getElementById("main");
  let home = document.getElementById("home");

  let staticHeight = 125

  let buttons = ["about", "portfolio", "social"]

  let transitionEnd = transitionEndEventName();

  let clearNav = function() {
    for(let i = 0; i < buttons.length; i++) {
      document.getElementById("nav").children[i].classList.remove("active");
      document.getElementById("content").children[i].style.opacity = "0"
      document.getElementById("content").children[i].classList.add("hidden");
    }
  }

  let reset = function() {
      clearNav();
      document.getElementById("content").style.height = "0"
      document.getElementById("content").style.padding = "0 10px"
      recenter(0);
  }

  let recenter = function(contentHeight) {
    let mainHeight = contentHeight + document.getElementById("title").clientHeight + document.getElementById("nav").clientHeight
    main.style.marginTop = `calc(50vh - ${mainHeight / 2}px - 20px)`
  }

  let makeActive = function(section) {
    document.getElementById(section).classList.remove("hidden")
    //document.getElementById("content").style.height = document.getElementById(section).clientHeight + "px"
    document.getElementById("content").style.height = `${staticHeight}px`
    document.getElementById("content").style.padding = "20px 10px"
    //recenter(document.getElementById(section).clientHeight)
    recenter(staticHeight)
    document.getElementById(section).style.opacity = "1.0"
    document.getElementById(section + "-link").classList.add("active")
  }

  home.addEventListener("click", function(event) {
    reset();
  });

  for(let i = 0; i < buttons.length; i++) {
    document.getElementById(buttons[i] + "-link").addEventListener("click", function(event) {
      clearNav();
      makeActive(buttons[i]);
    });
  }

  reset(0);
});
