$(document).ready(function() {


    $("body").click(start);
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
    showInput("#email", askEmail)
}