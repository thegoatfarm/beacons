var bgLoaded = false;
var bgImg = new Image();
bgImg.onload = function(){
  if (bgLoaded) {
   $(".bg").css("backgroundImage", 'url(' + bgImg.src + ')');
   showPage();
  } else {
    bgLoaded = true;
  }
};

var bgImg2 = new Image();
bgImg2.onload = function(){
  if (bgLoaded) {
   $(".bg2").css("backgroundImage", 'url(' + bgImg2.src + ')');
   showPage();
  } else {
    bgLoaded = true;
  }
};

function showPage() {
    $(".backgrounds").fadeIn();
    $(".main").fadeIn();
    $(".logo").fadeIn();
    $("#password").css("display", "inline-block");
    particles();
    $(".computer .text").typed({
            strings: ["Speak, friend, and enter."],
            typeSpeed: 7,
            startDelay: 300,
            backDelay: 600,
            callback: getPassword
        });
}


$(document).ready(function() {
  bgImg.src = "img/bg.png";
  bgImg2.src = "img/bg2.png";


  $(function() {
    $( "#age-slider" ).slider({
      value:18,
      min: 18,
      max: 65,
      step: 10,
      slide: function( event, ui ) {
        $( "#age-value" ).html(ui.value + "&ndash;" + (parseInt(ui.value) + 9));
      }
    });
    var value = $("#age-slider").slider("value");
    $("#age-value").html(value + "&ndash;" + (parseInt(value) + 9));
  });

});


function hideInput(elem) {
    $(elem).removeClass("transitions")
    $(elem).blur();
    $(elem).fadeOut();
    $(".next-btn").unbind("click");
    $("input").unbind("keypress");
}
function showInput(elem, next) {
    $(".typed-cursor").remove();
    $(elem).removeClass("hidden");
    $($(elem).find("input")[0]).focus();

    $(".next-btn").click(next);
    $("input").keypress(function(e) {
        if (e.keyCode === 13) next();
    });
}

function getPassword() {
    showInput($("#password"), askUser)
}

function askUser() {
    hideInput($("#password"));

    $(".computer").fadeOut(function() {
        $("#user").css("display", "inline-block");
        $(".computer").html("<span class='text'></span>");
        $(".computer").css("display", "block");
        $(".computer .text").typed({
            strings: ["Who goes there?"],
            typeSpeed: 10,
            startDelay: 100,
            backDelay: 750,
            callback: getUser
        });
    })
}

function getUser() {
    showInput("#user", thanks);
}

function thanks() {
    name = $("#name input").val();
    email = $("#email input").val();
    hideInput($("#user"));
    $(".computer").fadeOut(800, function() {
      $(".computer").html("<span class='text'></span>");
      $(".computer").css("display", "block");
      $(".computer .text").typed({
        strings: ["Thanks, " + name + ". <br>Welcome to Beacons."],
        typeSpeed: 10,
        startDelay: 100,
        backDelay: 750,
        callback: bgTransition
      });
    });

}

function bgTransition() {
  $(".bg").fadeOut(1000, function() {
    $(".computer").fadeOut(900, function() {
        $(".beacons-logo").fadeIn(1200);
        handshake();
    });
  });
  
}

function handshake() {
  $("#cool").css("display", "inline-block");
  $(".computer").html("<span class='text'></span>");
  $(".computer").css("display", "block");
  $(".computer .text").typed({
    strings: ["It seems a brief conversation and learning the secret handshake got you this far.", " We'll need to find out a little more information about you before we can move to second base. <br>Cool?"],
    typeSpeed: 8,
    startDelay: 10,
    backDelay: 1250,
    callback: askCool
  });
}

function askCool() {
  showInput("#cool", showBox)
}



function boxInput(elem, next, prev) {

    $(".next-button").unbind("click");
    $(".back-button").unbind("click");

    $(".info").fadeOut();
    $(elem).fadeIn();
    $($(elem).find("input")[0]).focus();

    $(".next-button").click(next);
    $(".back-button").click(prev);
    $("input").keypress(function(e) {
        if (e.keyCode === 13) next();
    });
}

function showMarker(i) {
  for (var j = 1; j <= i; j++ ) $("#m" + j).addClass("active");
  for (var j = i + 1; j <= 5; j++ ) $("#m" + j).removeClass("active");
}



function showBox() {
  $(".main").fadeOut(function() {
    $(".answer-box").fadeIn();
    boxInput($("#info1"), askPostal, function() {} );
    showMarker(1);

  });
}

function askPostal() {
  boxInput($("#info2"), askTrade, showBox );
  showMarker(2);
}

function askTrade() {
  boxInput($("#info3"), askSpace, askPostal );
  showMarker(3);
}

function askSpace() {
  boxInput($("#info4"), end, askTrade );
  showMarker(4);
}

function end() {
  boxInput($("#info5"), function() {}, function() {});
  showMarker(5);
  $(".navigation").fadeOut();

  var age = $("#age-slider").slider("value");
  var ageRange = age + "-" + (parseInt(age) + 9);

  var data = {
    password: $("#password").find("input").val(),
    name: $("#name").find("input").val(),
    email: $("#email").find("input").val(),
    age: ageRange,
    location: $("#postal").val(),
    trade: $("#trade").val(),
    opportunity: $("#opportunity").val(),
    timestamp: (new Date()).toString()
  };

  $.get("https://script.google.com/macros/s/AKfycbyP8o1UkJuC5H_g1hrFpvC6B7wSoCpU6ggKGpDN79tkpYlsznc/exec", data)
}


function particles() {
    particlesJS('particles-js', {
      particles: {
        color: '#bc0c11',
        color_random: false,
        shape: 'circle', // "circle", "edge" or "triangle"
        opacity: {
          opacity: 1,
          anim: {
            enable: false,
            speed: 1.5,
            opacity_min: 0,
            sync: false
          }
        },
        size: 2.5,
        size_random: false,
        nb: 30,
        line_linked: {
          enable_auto: true,
          distance: 140,
          color: '#bc0c11',
          opacity: 1,
          width: 1,
          condensed_mode: {
            enable: false,
            rotateX: 600,
            rotateY: 600
          }
        },
        anim: {
          enable: true,
          speed: 1
        }
      },
      interactivity: {
        enable: true,
        mouse: {
          distance: 250
        },
        detect_on: 'window', // "canvas" or "window"
        mode: 'grab', // "grab" of false
        line_linked: {
          opacity: .5
        },
        events: {
          onclick: {
            enable: false,
            mode: 'push', // "push" or "remove"
            nb: 4
          },
          onresize: {
            enable: true,
            mode: 'out', // "out" or "bounce"
            density_auto: false,
            density_area: 800 // nb_particles = particles.nb * (canvas width *  canvas height / 1000) / density_area
          }
        }
      },
      /* Retina Display Support */
      retina_detect: true
    });
}
