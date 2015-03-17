$(document).ready(function() {


    $("body").click(function() {
        start();
        return false;
    });
    $("body").keypress(function(e) {
        if (e.keyCode === 13) start();
    });

    $(".computer .text").typed({
            strings: ["Hello.", "Tap or press enter to continue."],
            typeSpeed: 10,
            startDelay: 100,
            backDelay: 600
        });
});


function hideInput(elem) {
    $(elem).removeClass("transitions")
    $(elem).fadeOut();
    $(".chevron").unbind("click");
    $("input").unbind("keypress");
}
function showInput(elem, next) {
    $(".typed-cursor").remove();
    $(elem).removeClass("hidden");
    $(elem).children("input").focus();

    $(".chevron").click(next);
    $("input").keypress(function(e) {
        if (e.keyCode === 13) next();
    });
}

function start() {
    $("body").unbind("click");
    $("body").unbind("keypress");
    $(".computer").fadeOut(function() {
        $("#name").css("display", "inline-block");
        $(".computer").html("<span class='text'></span>");
        $(".computer").css("display", "block");
        $(".computer .text").typed({
            strings: ["To get started, can I have your name?"],
            typeSpeed: 10,
            startDelay: 100,
            backDelay: 600,
            callback: getName
        });
    })
}

function getName() {
    showInput($("#name"), askEmail)
}

function askEmail() {
    name = $("#name input").val();
    hideInput($("#name"));

    $(".computer").fadeOut(function() {
        $("#email").css("display", "inline-block");
        $(".computer").html("<span class='text'></span>");
        $(".computer").css("display", "block");
        $(".computer .text").typed({
            strings: ["Thanks, " + name + ". Welcome to Beacons.", "Now, can I have your email?"],
            typeSpeed: 10,
            startDelay: 100,
            backDelay: 750,
            callback: getEmail
        });
    })
}

function getEmail() {
    showInput("#email", takeBreak)
}

function takeBreak() {
    email = $("#email input").val();
    hideInput($("#email"));
    $(".computer").fadeOut(800);

    $(".bg").fadeOut(1000, function() {
        $(".beacons-logo").fadeIn(1200);
    });

}



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