var bgLoaded = false;
var bgImg = new Image();
var surveyData;
var userData = {};

var font1 = "tk-brandon-grotesque";
var font2 = "tk-prestige-elite-std";


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
    // $("#password").css("display", "inline-block");
    // WARNING: fails silently
    $.getJSON("js/survey.json", function(data) {
      surveyData = data;
      startSurveyQuestionsLoop(surveyData.questions);
    });
    particles();
    // $(".computer .text").typed({
    //         strings: ["Speak, friend, and enter."],
    //         typeSpeed: 7,
    //         startDelay: 300,
    //         backDelay: 600,
    //         callback: getPassword
    //     });
}

function startSurveyQuestionsLoop (questions) {

  // initialize base question div
  $(".survey-container").html("<div class='question-container'></div>");
  var questionContainer = $(".question-container");
  questionContainer.attr("opacity", 0);

  var questionIndex = 0;
  displayQuestion(questions[questionIndex]);

  $(window).on("nextQuestion", function(e) {
    // save user data
    questionContainer.find("input").each(function() {
      userData[$(this).attr("id")] = $(this).val();
    });

    // fade out and remove old content
    questionContainer.animate({
      "opacity": 0
    }, function() {

      questionContainer.html("");
      questionIndex++;
      if (questionIndex < questions.length) displayQuestion(questions[questionIndex]);
      else $(window).off("nextQuestion");
      
    });

  });


}

function displayQuestion (question) {

  var questionContainer = $(".question-container");

  if (question.question) {
    questionContainer.append("<div class='question-text " + font2 + "'>" + parseQuestionString(question.question) + "</div>");
  }

  if (question.inputs && question.inputs.length > 0) {
    questionContainer.append("<div class='inputs " + font1 + "'></div>");
    var inputsDiv = questionContainer.find(".inputs");

    for (var i = 0; i < question.inputs.length; i++) {
      var currentInput = question.inputs[i];
      var newInput = $("<input>");
      if (currentInput.placeholder) newInput.attr("placeholder", currentInput.placeholder);
      if (currentInput.type) newInput.attr("type", currentInput.type);
      if (currentInput.dataId) newInput.attr("id", currentInput.dataId);
      var wrappedInput = $("<div class='input'></div>");
      wrappedInput.html(newInput);
      inputsDiv.append(wrappedInput);
    }

    var inputs = inputsDiv.find(".input");
    $(inputs[0]).find("input").focus();

    inputs.each(function(i) {
        $(this).keypress(function(e) {
          if (e.which == 13) {
            if (i < inputs.length - 1) {
              $(inputs[i + 1]).find("input").focus();
            } else {
              $(this).trigger("nextQuestion");
            }
          }
        })
    });

    // add default next chevron
    if (!question.button) {
      inputsDiv.find(".input:last-child").append("<div class='next-chevron'></div>");
      $(".next-chevron").on("click", function(e) {
        $(this).trigger("nextQuestion");
      });

    }
  }

  if (question.button) {
    switch (question.button.type) {

      case "regular":
        questionContainer.append("<div class='next-button " + font1 + "'>" + question.button.text + "</div>");
        questionContainer.find(".next-button").on("click", function(e) {
          $(this).trigger("nextQuestion");
        });
        break;
      case "boxed":
        questionContainer.append("<div class='boxed-button " + font1 + "'>" + question.button.text + "</div>");
        questionContainer.find(".boxed-button").on("click", function(e) {
          $(this).trigger("nextQuestion");
        });
        break;

    }
  }

  if (!question.inputs && !question.button) {
    setTimeout(function() {
      $(window).trigger("nextQuestion");
    }, question.waitTime || 2000);
  }

  if (question.nextBackground) {
    bgTransition();
  }

  questionContainer.animate({
    "opacity": 1
  });
}


function parseQuestionString(questionText) {
  var regex = /:\{\S+\}/g;
  return questionText.replace(regex, function(x) {
    return userData[x.slice(2,-1)];
  });
}

function bgTransition() {
  $(".bg").fadeOut(1000, function() {
    $(".beacons-logo").fadeIn(1200);
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

function boxInput(elem, next, prev) {

    $("input").unbind("keypress");
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
      "particles": {
        "number": {
          "value": 70,
          "density": {
            "enable": true,
            "value_area": 1000
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
          "value": 0.7,
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
            "size_min": 0.1,
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
