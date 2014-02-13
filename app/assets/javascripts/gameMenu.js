customNodeChoice = 1;
customVaccineChoice = 1;
customNeighborChocie = 1;
customOutbreakChoice = 1;

var speed = false;
var toggleDegree = true;

function initBasicMenu() {
//    d3.select("body").append("div")
//        .attr("class", "vaxLogoDiv")
//        .text("VAX!")
//        .style("cursor", "pointer")
//        .on("click", function() {
//            window.location.href = '/'
//        })

    d3.select(".vaxLogoDiv")
        .style("visibility", "visible")

    d3.select(".vaxLogoDiv")
        .style("left", "-12px")

    // new game header at top-left
    d3.select("body").append("div")
        .attr("class", "newGameHeader")
        .text("NEW GAME")

    // difficulty selection div
    d3.select("body").append("div")
        .attr("class", "difficultySelection")

    // header for difficulty selection
    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyHeader")
        .text("DIFFICULTY")

    // difficulty menu items
    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItem")
        .attr("id", "difficultyEasy")
        .text("Easy")
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "#707070")
        })
        .on("click", function() {
            difficultyString = "easy"
            initBasicGame(difficultyString);
        })

    d3.select(".difficultySelection").append("div")
        .attr("class", "easyHi")
        .style("position", "absolute")
        .style("top", "85px")
        .style("left", "100px")
        .style("color", "#BABABA")
        .style("font-family", "Nunito")
        .style("font-weight", "500")
        .style("font-size", "20px")
        .text("")

    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyMedium")
        .text("Medium")

    d3.select(".difficultySelection").append("div")
        .attr("class", "mediumHi")
        .style("position", "absolute")
        .style("top", "133px")
        .style("left", "152px")
        .style("color", "#BABABA")
        .style("font-family", "Nunito")
        .style("font-weight", "500")
        .style("font-size", "20px")
        .text("")

    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyHard")
        .text("Hard")

    d3.select(".difficultySelection").append("div")
        .attr("class", "hardHi")
        .style("position", "absolute")
        .style("top", "182px")
        .style("left", "100px")
        .style("color", "#BABABA")
        .style("font-family", "Nunito")
        .style("font-weight", "500")
        .style("font-size", "20px")
        .text("")

    d3.select(".difficultySelection").append("div")
        .attr("class", "difficultyItemGrey")
        .attr("id", "difficultyCustom")
        .text("Custom")

    d3.select(".difficultySelection").append("div")
        .attr("class", "gameOptionsHeader")
        .text("GAME OPTIONS")
        .style("position", "absolute")
        .style("top", "35px")
        .style("width", "200px")
        .style("left", "600px")
        .style("color", "#707070")
        .style("font-family", "Nunito")
        .style("font-weight", "700")
        .style("font-size", "24px")

    d3.select(".difficultySelection").append("div")
        .attr("class", "networkDisplay")
        .text("Network Display")
        .style("position", "absolute")
        .style("top", "100px")
        .style("width", "200px")
        .style("left", "600px")
        .style("color", "#707070")
        .style("font-family", "Nunito")
        .style("font-weight", "300")
        .style("font-size", "22px")

    d3.select(".difficultySelection").append("div")
        .attr("class", "degreeToggleMenuTrue")
        .text("Show Degree")
        .style("position", "absolute")
        .style("top", "125px")
        .style("width", "200px")
        .style("left", "600px")
        .style("color", "#2692F2")
        .style("font-family", "Nunito")
        .style("font-weight", "500")
        .style("font-size", "18px")
        .style("cursor", "pointer")
        .on("click", function() {
            d3.select(".degreeToggleMenuTrue").style("color", "#2692F2").style("font-weight", "500")
            d3.select(".degreeToggleMenuFalse").style("color", "#BABABA").style("font-weight", "300")

            toggleDegree = true;

        })

    d3.select(".difficultySelection").append("div")
        .attr("class", "degreeToggleMenuFalse")
        .text("Hide Degree")
        .style("position", "absolute")
        .style("top", "125px")
        .style("width", "200px")
        .style("left", "725px")
        .style("color", "#BABABA")
        .style("font-family", "Nunito")
        .style("font-weight", "300")
        .style("font-size", "18px")
        .style("cursor", "pointer")
        .on("click", function() {
            d3.select(".degreeToggleMenuTrue").style("color", "#BABABA").style("font-weight", "300")
            d3.select(".degreeToggleMenuFalse").style("color", "#2692F2").style("font-weight", "500")

            toggleDegree = false;
        })



    d3.select(".difficultySelection").append("div")
        .attr("class", "quarantineModeOptions")
        .text("Quarantine Phase")
        .style("position", "absolute")
        .style("top", "165px")
        .style("width", "200px")
        .style("left", "600px")
        .style("color", "#707070")
        .style("font-family", "Nunito")
        .style("font-weight", "300")
        .style("font-size", "22px")

    d3.select(".difficultySelection").append("div")
        .attr("class", "turnBasedTrue")
        .text("Turn-based")
        .style("position", "absolute")
        .style("top", "190px")
        .style("width", "200px")
        .style("left", "600px")
        .style("color", "#2692F2")
        .style("font-family", "Nunito")
        .style("font-weight", "500")
        .style("font-size", "18px")
        .style("cursor", "pointer")
        .on("click", function() {
            d3.select(".turnBasedTrue").style("color", "#2692F2").style("font-weight", "500")
            d3.select(".realTimeTrue").style("color", "#BABABA").style("font-weight", "300")

            speed = false;

            if (vaxEasyHiScore == -Infinity) {}
            else d3.select(".easyHi").text("(Best: " + vaxEasyHiScore + "%)")


            if (vaxMediumHiScore == -Infinity) {}
            else d3.select(".mediumHi").text("(Best: " + vaxMediumHiScore + "%)")

            if (vaxHardHiScore == -Infinity) {}
            else d3.select(".hardHi").text("(Best: " + vaxHardHiScore + "%)")




        })

    d3.select(".difficultySelection").append("div")
        .attr("class", "realTimeTrue")
        .text("Real-time")
        .style("position", "absolute")
        .style("top", "190px")
        .style("width", "200px")
        .style("left", "705px")
        .style("color", "#BABABA")
        .style("font-family", "Nunito")
        .style("font-weight", "300")
        .style("font-size", "18px")
        .style("cursor", "pointer")
        .on("click", function() {
            d3.select(".turnBasedTrue").style("color", "#BABABA").style("font-weight", "300")
            d3.select(".realTimeTrue").style("color", "#2692F2").style("font-weight", "500")

            speed = true;

            if (vaxEasyHiScoreRT < 0) d3.select(".easyHi").text("")
            else d3.select(".easyHi").text("(Best: " + vaxEasyHiScoreRT + "%)")

            if (vaxMediumHiScoreRT < 0) d3.select(".mediumHi").text("")
            else d3.select(".mediumHi").text("(Best: " + vaxMediumHiScoreRT + "%)")

            if (vaxHardHiScoreRT < 0) d3.select(".hardHi").text("")
            else d3.select(".hardHi").text("(Best: " + vaxHardHiScoreRT + "%)")


        })




}


function initCustomMenu() {

    d3.select(".difficultySelection").style("top", "40px")

    d3.selectAll(".difficultyItem").remove()
    d3.selectAll(".difficultyItemHighlight").remove()
    d3.selectAll(".difficultyItemGrey").remove()
    d3.selectAll(".difficultyCustom").remove()
    d3.selectAll(".difficultyHeader").remove()

    d3.select("#customMenuDiv").style("visibility", "visible")

    d3.select("#customNodes").text("Nodes: " + parseInt($.cookie('customNodes')))
    d3.select("#customDegree").text("Neighbors: " + parseInt($.cookie('customNeighbors')) + "ea.")
    d3.select("#customVaccines").text("Vaccines: " + parseInt($.cookie('customVaccines')))
    d3.select("#customRefusers").text("Refusers: " + parseInt($.cookie('customRefusers')))
    d3.select("#customOutbreaks").text("Outbreaks: " + parseInt($.cookie('customOutbreaks')))


    d3.selectAll(".ui-state-default").style("background", "white")
    d3.selectAll(".ui-corner-all").style("border-radius", "50px")


    d3.select("#customMenuDiv").append("text")
        .attr("class", "okayButton")
        .text("OKAY")
        .on("click", function() {
            d3.select(this).remove();
            d3.select(".vaxLogoDiv").remove();

            initCustomGame();




        })


}

var maxVax = parseInt($.cookie('customNodes'))
$(function() {
    $( "#nodeSlider").slider({
        range: "min",
        min: 10,
        max: 500,
        value: customNodeChoice,
        slide: function (event, ui) {
            $.cookie.json = false;
            $.cookie('customNodes', ui.value)
            $.cookie.json = true;
            $("#customNodes").text("Nodes: " + ui.value);
            customNodeChoice = ui.value;

            customVaccineChoice = Math.round(0.10 * customNodeChoice)
            d3.select("#customVaccines").text("Vaccines: " + Math.round(0.10 * customNodeChoice))
            $( "#vaccineSlider").slider({
                max: customNodeChoice,
                value: Math.round(0.10 * customNodeChoice)});

            customRefuserChoice = Math.round(0.05 * customNodeChoice)
            d3.select("#customRefusers").text("Refusers: " + Math.round(0.05 * customNodeChoice))
            $( "#refuserSlider").slider({
                max: customNodeChoice,
                value: Math.round(0.05 * customNodeChoice)});


        }
    });
    $( "#nodeSlider" ).slider( "value", parseInt($.cookie('customNodes')));
});

$(function() {
    $( "#degreeSlider").slider({
        range: "min",
        min: 1,
        max: 8,
        value: customNeighborChoice,
        slide: function (event, ui) {
            $.cookie.json = false;
            $.cookie('customNeighbors', ui.value)
            $.cookie.json = true;
            $("#customDegree").text("Neighbors: " + ui.value + "ea.");
            customNeighborChoice = ui.value;
        }
    });
    $( "#degreeSlider").slider( "value", parseInt($.cookie('customNeighbors')));
});

$(function() {
    $( "#vaccineSlider").slider({
        range: "min",
        min: 1,
        max: maxVax,
        value: customVaccineChoice,
        slide: function (event, ui) {
            $.cookie.json = false;
            $.cookie('customVaccines', ui.value)
            $.cookie.json = true;
            $("#customVaccines").text("Vaccines: " + ui.value);
            customVaccineChoice = ui.value;
        }
    });

    $( "#vaccineSlider").slider( "value", parseInt($.cookie('customVaccines')))

});

$(function() {
    $( "#outbreakSlider").slider({
        range: "min",
        min: 1,
        max: 5,
        value:customOutbreakChoice,
        slide: function (event, ui) {
            $.cookie.json = false;
            $.cookie('customOutbreaks', ui.value)
            $.cookie.json = true;
            $("#customOutbreaks").text("Outbreaks: " + ui.value);
            customOutbreakChoice = ui.value;
        }
    });
    $( "#outbreakSlider").slider( "value", parseInt($.cookie('customOutbreaks')))
});

$(function() {
    $( "#refuserSlider").slider({
        range: "min",
        min: 0,
        max: maxVax,
        value:customRefuserChoice,
        slide: function (event, ui) {
            $.cookie.json = false;
            $.cookie('customRefusers', ui.value)
            $.cookie.json = true;
            $("#customRefusers").text("Refusers: " + ui.value);
            customRefuserChoice = ui.value;
        }
    });
    $( "#refuserSlider").slider( "value", parseInt($.cookie('customRefusers')))
});


function readCookiesJSON() {
    $.cookie.json = true;
    var cookies = $.cookie('vaxCookie')

    if (cookies == undefined) initCookiesJSON();

    cookie = $.cookie('vaxCookie')

    vaxEasyCompletion = cookie.easy;
    vaxMediumCompletion = cookie.medium;
    vaxHardCompletion = cookie.hard;

    vaxEasyHiScore = Math.max.apply( Math, cookie.scores[0])
    vaxMediumHiScore = Math.max.apply( Math, cookie.scores[1])
    vaxHardHiScore = Math.max.apply( Math, cookie.scores[2])

    if (cookie.scoresRT == undefined) {
        var easyScoresRT = [];
        var mediumScoresRT = [];
        var hardScoresRT = [];
        var scoreRT = [easyScoresRT, mediumScoresRT, hardScoresRT]

        cookie.scoresRT = scoreRT;

    }

    vaxEasyHiScoreRT = Math.max.apply( Math, cookie.scoresRT[0])
    vaxMediumHiScoreRT = Math.max.apply( Math, cookie.scoresRT[1])
    vaxHardHiScoreRT = Math.max.apply( Math, cookie.scoresRT[2])

    $.cookie.json = false;
    customNodeChoice = parseInt($.cookie().customNodes);
    customNeighborChoice = parseInt($.cookie().customNeighbors);
    customVaccineChoice = parseInt($.cookie().customVaccines);
    customOutbreakChoice = parseInt($.cookie().customOutbreaks);
    customRefuserChoice = parseInt($.cookie().customRefusers);


    if (isNaN(customNodeChoice)) {
        customNodeChoice = 75;
        $.cookie('customNodes', 75)
    }
    if (isNaN(customNeighborChoice)) {
        customNeighborChoice = 3;
        $.cookie('customNeighbors', 3)

    }
    if (isNaN(customVaccineChoice)) {
        customVaccineChoice = 10;
        $.cookie('customVaccines', 10)

    }
    if (isNaN(customOutbreakChoice)) {
        customOutbreakChoice = 2;
        $.cookie('customOutbreaks', 2)
    }
    if (isNaN(customRefuserChoice)) {
        customRefuserChoice = 0.05;
        $.cookie('customRefusers', 0.05)

    }

    $.cookie.json = true;

    initSocialShare();
    cookieBasedModeSelection();
}

function initCookiesJSON() {
    var oldCookieTest = $.cookie('vaxEasyCompletion');


    if (oldCookieTest || isNaN(customNodeChoice)) clearCookies();
    else { if (!oldCookieTest || isNaN(customNodeChoice)) clearCookies();}

    $.cookie('customNodes', 75)
    $.cookie('customNeighbors', 3)
    $.cookie('customVaccines', 10)
    $.cookie('customOutbreaks', 2)
    $.cookie('customRefusers', 0.05)


    $.cookie.json = true;

    easyScores = [];
    mediumScores = [];
    hardScores = [];
    var score = [easyScores, mediumScores, hardScores];

    easyScoresRT = [];
    mediumScoresRT = [];
    hardScoresRT = [];
    var scoreRT = [easyScoresRT, mediumScoresRT, hardScoresRT];

    var cookie = {easy: false, medium: false, hard: false, scores: score, scoresRT: scoreRT}

    $.cookie('vaxCookie', JSON.stringify(cookie), { expires: 365, path: '/' })

}


