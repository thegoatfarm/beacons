var bgLoaded = false;
var bgImg = new Image();
var surveyData;
var userData = {};

var font1 = "tk-brandon-grotesque";
var font2 = "tk-prestige-elite-std";

var bgImg2 = new Image();
bgImg2.onload = function(){
  $(".bg2").css("backgroundImage", 'url(' + bgImg2.src + ')');
  showPage();
};

function showPage() {
    $(".backgrounds").fadeIn();
    $(".logo").fadeIn();
    $(".beacons-logo").fadeIn(1200);
    $(".survey-container").fadeIn(1200);
    particles();
}

$(document).ready(function() {
  bgImg2.src = "img/bg2.png";
});

function particles() {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 60,
          "density": {
            "enable": true,
            "value_area": 2000
          }
        },
        "color": {
          "value": "#bc0c11"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#bc0c11"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.6,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 0.6,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 5,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 50,
            "size_min": 0.5,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 300,
          "color": "#bc0c11",
          "opacity": 0.4,
          "width": 2
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "window",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 200,
            "line_linked": {
              "opacity": 0.6
            }
          },
          "bubble": {
            "distance": 800,
            "size": 80,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 400,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 2
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
}
