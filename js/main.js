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
      // startBoxedSurveyLoop(surveyData.boxedQuestions);
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
      if (questionIndex < questions.length) {
        displayQuestion(questions[questionIndex]);
      } else  {
        $(window).off("nextQuestion");
        startBoxedSurveyLoop(surveyData.boxedQuestions);
      }
      
    });

  });


}

function displayQuestion (question) {

  var questionContainer = $(".question-container");

  if (question.question) {
    if (question.typed) {
      var questionText = $("<div class='question-text typing " + font2 + "'></div>");
      var parsedString = parseQuestionString(question.question);
      for (var i = 0; i < parsedString.length; i++) {
        questionText.append("<span>" + parsedString[i] + "</span>");
      }
      questionContainer.append(questionText);
    } else {
      questionContainer.append("<div class='question-text " + font2 + "'>" + parseQuestionString(question.question) + "</div>");
    }
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

  // typewriter effect
  if (question.typed) {
    var characters = questionContainer.find(".question-text span");
    var i = 0;
    var timer = setInterval(function() {
      $(characters[i]).addClass("typed");
      i++;
      if (i >= characters.length) clearInterval(timer);
    }, 30);
  }
}

function startBoxedSurveyLoop (questions) {

  var box = $("<div class='survey-box'><div class='question-container'></div></div>");
  var navigation = $('<div class="navigation ' + font1 + '"><span class="back-button">&lt;</span><div class="progress"><span id="m1" class="marker"></span><span id="m2" class="marker"></span><span id="m3" class="marker"></span><span id="m4" class="marker"></span><span id="m5" class="marker"></span></div><span class="next-button">NEXT &gt;</span></div>');
  box.append(navigation);
  box.attr("opacity", 0);

  navigation.find(".next-button").on("click", function(e) {
    $(this).trigger("nextQuestion");
  });

  navigation.find(".back-button").on("click", function(e) {
    $(this).trigger("prevQuestion");
  });

  $(".survey-container").html(box);
  box.animate({
    "opacity": 1
  });

  var questionContainer = $(".question-container");

  var questionIndex = 0;
  displayBoxedQuestion(questions[questionIndex]);
  showMarker(1);

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
      if (questionIndex >= questions.length - 1) {
        displayBoxedQuestion(questions[questionIndex]);
        showMarker(questionIndex + 1);
        $(window).off("nextQuestion");
        $(window).off("prevQuestion");
        navigation.fadeOut();
        submitData();
      } else if (questionIndex < questions.length) {
        displayBoxedQuestion(questions[questionIndex]);
        showMarker(questionIndex + 1);
      }
      
    });

  });

  $(window).on("prevQuestion", function(e) {

    if (questionIndex > 0) {

      // fade out and remove old content
      questionContainer.animate({
        "opacity": 0
      }, function() {
        questionContainer.html("");
        questionIndex--;
        displayBoxedQuestion(questions[questionIndex]);
        showMarker(questionIndex + 1);
      });

    }

  });

}

function displayBoxedQuestion (question) {

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
      if (currentInput.dataId) {
        newInput.attr("id", currentInput.dataId);
        if (userData[currentInput.dataId]) newInput.val(userData[currentInput.dataId]);
      }
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
  }

  if (question.slider) {
    questionContainer.append("<div class='slider-container'></div>");

    var sliderContainer = $(".slider-container");
    var sliderWidth = 400;
    var offset = sliderContainer.offset();
    var lastPos = (sliderWidth - 30) / (question.slider.values.length - 1);
    var posIndex = 0;
    var draggableDot = $("<div class='draggable-dot'></div>");
    var sliderValueText = $("<span class='slider-value " + font1 + "'></span>");
    sliderValueText.text(question.slider.values[0]);
    userData[question.slider.dataId] = question.slider.values[0];

    for (var i = 0; i < question.slider.values.length; i++) {
      var newDivider = $("<div class='divider'></div>");
      var pos = 15 + i * ((sliderWidth - 30) / (question.slider.values.length - 1));
      newDivider.css("left", pos + "px");
      newDivider.attr("data-index", i);
      newDivider.click(function(e) {
        posIndex = parseInt($(this).attr("data-index"));
        var snapped = posIndex * lastPos + 7;
        draggableDot.css("left", snapped + "px");
        sliderValueText.text(question.slider.values[posIndex]);
        userData[question.slider.dataId] = question.slider.values[posIndex];
      });
      sliderContainer.append(newDivider);
    }

    questionContainer.append(sliderValueText);

    var isDragging = false;
    draggableDot.mousedown(function() {
      isDragging = true;
    });
    $(window).mousemove(function(e) {
      if (isDragging) {
        var posX = e.pageX - offset.left - 7;
        if (posX < 7) posX = 7;
        else if (posX > sliderWidth - 22) posX = sliderWidth - 22;
        posIndex = Math.round(posX / (lastPos));
        sliderValueText.text(question.slider.values[posIndex]);
        draggableDot.css("left", posX + "px");
      }
    })
    .mouseup(function(e) {
      if (isDragging) {
        var posX = e.pageX - offset.left - 7;
        if (posX < 7) posX = 7;
        else if (posX > sliderWidth - 22) posX = sliderWidth - 22;
        var snapped = posIndex * lastPos + 7;
        draggableDot.css("left", snapped + "px");

        userData[question.slider.dataId] = question.slider.values[posIndex];
      }
      isDragging = false;
    });
    sliderContainer.append(draggableDot);
  }

  if (question.nextBackground) {
    bgTransition();
  }

  questionContainer.animate({
    "opacity": 1
  });

}


function parseQuestionString (questionText) {
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
});

function showMarker(i) {
  for (var j = 1; j <= i; j++ ) $("#m" + j).addClass("active");
  for (var j = i + 1; j <= 5; j++ ) $("#m" + j).removeClass("active");
}

function submitData () {
  userData.timestamp = (new Date()).toString();
  $.get("https://script.google.com/macros/s/AKfycbyP8o1UkJuC5H_g1hrFpvC6B7wSoCpU6ggKGpDN79tkpYlsznc/exec", userData);

  // mailchimp
  // "https://us2.api.mailchimp.com/3.0/"
}


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
          "value": 0.8,
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
