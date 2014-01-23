// menu variables
var drawButton = false;
var scenarioTitle;

// game constant arrays
var vaxDifficulty;
var transmissionDifficulty;
var recoveryDifficulty;
var independentOutbreakDifficulty;
var refuserDifficulty;

// cookies
var unlocks;

// actual game constants
var graph;
var numberOfIndividuals;
var numberOfRefusers;
var numberOfVaccines;
var independentOutbreaks;
var transmissionRate;
var recoveryRate;
var speed = false;

// jquery-ui accordion function that draws difficulty buttons in each panel
$(function() {
    $( "#accordion" ).accordion();
    drawDifficultyButtons();
    checkUnlockables();
});
$( "#accordion" ).accordion({ heightStyle: "auto" });

// vax logo, top left
d3.select("body").append("div")
    .attr("class", "scenarioVaxLogoDiv")
    .text("VAX!")
    .style("cursor", "pointer")
    .on("click", function() {
        window.location.href = 'http://vax.herokuapp.com/'
    })

// scenario title above jquery-ui accordion
d3.select("body").append("div")
    .attr("class", "scenarioTitle")
    .text("Scenarios")
    .style("position", "absolute")
    .style("top", "170px")
    .style("left", "200px")
    .style("font-family", "Nunito")
    .style("font-size", "32px")
    .style("font-weight", "400")
    .style("color" , "#707070")

// difficulty buttons, w/ onclick and mouseover
function drawDifficultyButtons() {
    if (!drawButton) {
        drawButton = true;
        d3.selectAll(".actionBay").append("svg")
            .attr({
                "width": 500,
                "height": 50
            })
            .attr("class", "svg")
            .attr("pointer-events", "all")
            .style("position", "relative")
            .style("left", "160px")

        d3.selectAll(".svg").append("text")
            .attr("class", "easyText")
            .attr("x", 0)
            .attr("y", 25)
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", "500")
            .style("font-size", "20px")
            .style("cursor", "pointer")
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll(".svg").append("text")
            .attr("class", "mediumText")
            .attr("x", 145)
            .attr("y", 25)
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", "500")
            .style("font-size", "20px")
            .style("cursor", "pointer")
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll(".svg").append("text")
            .attr("class", "hardText")
            .attr("x", 325)
            .attr("y", 25)
            .style("fill", "#707070")
            .style("font-family", "Nunito")
            .style("font-weight", "500")
            .style("font-size", "20px")
            .style("cursor", "pointer")
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});

//        d3.select("#originalScenarioText").append("div")
//            .style("color", "#707070")
//            .style("font-family", "Nunito")
//            .style("font-weight", "500")
//            .style("font-size", "20px")
//            .style("position", "absolute")
//            .style("padding-top", "15px")
//            .style("left", "375px")
//            .style("cursor", "pointer")
//            .text("Go!")
//            .on("mouseover", function() {
//                d3.select(this).style("color", "#2692F2")
//            })
//            .on("mouseout", function() {
//                d3.select(this).style("color", "#707070")
//            })
//            .on("click", function() {window.location.href = 'http://0.0.0.0:3000/game'});
    }
}

function selectScenario(difficulty) {
    // when called, it will record the current active header title (scenario title)
    scenarioTitle = $(".ui-accordion-header-active").text();

    // conditional statements determine which scenario we're in and which constant to choose, given difficulty input
    // graph is then drawn to spec
    if (scenarioTitle == "Workplace / School") {
        numberOfIndividuals = 54;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,5,10];
    }
    if (scenarioTitle == "Movie Theater / Lecture Hall") {
        numberOfIndividuals = 48;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,5,10];
    }
    if (scenarioTitle == "Restaurant") {
        numberOfIndividuals = 30;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,3,8];
    }
    if (scenarioTitle == "Organization") {
        numberOfIndividuals = 50;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,5,10];
    }
    if (scenarioTitle == "Shopping") {
        numberOfIndividuals = 25;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,3,8];
    }

    if (scenarioTitle == "Random Networks") {
        numberOfIndividuals = 25;
        vaxDifficulty = [5,5,5];
        transmissionDifficulty = [0.25, 0.5, 0.75];
        recoveryDifficulty = [0.5, 0.25, 0.1];
        independentOutbreakDifficulty = [1,1,1];
        refuserDifficulty = [0,3,8];
    }


    // now that the difficulty values have been chosen based on scenario, we set them based on difficulty
    setDifficultyConstants(scenarioTitle, difficulty);


    // remove accordion & title + move logo down

    d3.select("#accordion").remove()
    d3.select(".scenarioVaxLogoDiv").attr("class", "gameVaxLogoDiv").style("left", "0px")
    d3.select(".scenarioTitle").remove()

    //init footer nad move it down
    initFooter();
    d3.select(".gameMenuBox")
        .transition()
        .duration(100)
        .style("right", "0px")


    // reset onClick for development purposes
    d3.select(".gameMenuBox")
        .on("click", function() {
            window.location.href = 'http://0.0.0.0:3000/scenario'
        })

    window.setTimeout(function() {window.location.href = 'http://0.0.0.0:3000/scenarioGame'}, 500)
}

function createUnlocksCookie() {
    // object of unlocks for first scenario & random
    var initial = {easy: true, medium: false, hard:false};
    // object of unlocks for all the rest
    var locked = {easy: false, medium: false, hard:false};


    // unlocks object, to be strified into JSON cookie
    var unlocks = {work: {difficulty: initial}, theater: {difficulty:locked}, restaurant: {difficulty:locked}, club:  {difficulty:locked}, shop:  {difficulty:locked}, original:  {difficulty:initial}}

    // create JSON unlocks cookie
    $.cookie.json = true;
    var stringifiedUnlocks = JSON.stringify(unlocks);
    $.cookie('vaxUnlocks', stringifiedUnlocks, { expires: 365, path: '/' })
    unlocks = $.cookie('vaxUnlocks')
    console.log($.cookie('vaxUnlocks'))

}

function checkUnlockables() {
    $.cookie.json = true;
    unlocks = $.cookie('vaxUnlocks')
    if (unlocks == undefined) createUnlocksCookie();
    else modifyMenuByUnlocks();

}

function modifyMenuByUnlocks() {
    disableDropdowns();
    disableDifficultyText();
}

function disableDropdowns() {
    if (unlocks.theater.difficulty.easy == false) $("#theater").addClass( "ui-state-disabled" );
    if (unlocks.restaurant.difficulty.easy == false) $("#restaurant").addClass( "ui-state-disabled" );
    if (unlocks.club.difficulty.easy == false) $("#club").addClass( "ui-state-disabled" );
    if (unlocks.shop.difficulty.easy == false) $("#shop").addClass( "ui-state-disabled" );
}

function disableDifficultyText() {
//    var scenarios = [unlocks.work, unlocks.theater, unlocks.restaurant, unlocks.club, unlocks.shop, unlocks.original]
//
//    var easyTexts = d3.selectAll(".svg").selectAll(".easyText")
//    var mediumTexts = d3.selectAll(".svg").selectAll(".mediumText")
//    var hardTexts = d3.selectAll(".svg").selectAll(".hardText")
//
//    for (var i = 0; i < easyTexts.length; i++) {
//        if (scenarios[i].difficulty.easy == false) {
//            d3.selectAll(".svg").select(".easyText")[i]
//                .style("cursor", "no-drop")
//                .on("mouseover", function() {
//                     d3.select(this).style("fill", "#707070")
//                }
//            )
//        }
//    }
//
//    for (var i = 0; i < mediumTexts.length; i++) {
//        if (scenarios[i].difficulty.easy == false) {
//            d3.selectAll(".svg").select(".mediumText")[i]
//                .style("cursor", "no-drop")
//                .on("mouseover", function() {
//                    d3.select(this).style("fill", "#707070")
//                }
//            )
//        }
//    }
//
//    for (var i = 0; i < hardTexts.length; i++) {
//        if (scenarios[i].difficulty.easy == false) {
//            d3.selectAll(".svg").select(".hardText")[i]
//                .style("cursor", "no-drop")
//                .on("mouseover", function() {
//                    d3.select(this).style("fill", "#707070")
//                }
//            )
//        }
//    }
}

function setDifficultyConstants(scenarioTitle, difficulty) {
    var index;

    if (scenarioTitle != "Random Networks") {
        if (difficulty == "easy") {
            index = 0;
            numberOfRefusers = refuserDifficulty[0];
            numberOfVaccines = vaxDifficulty[0];
            independentOutbreaks = independentOutbreakDifficulty[0];
            transmissionRate = transmissionDifficulty[0];
            recoveryRate = recoveryDifficulty[0];
        }
        if (difficulty == "medium") {
            index = 1;
            numberOfRefusers = refuserDifficulty[1];
            numberOfVaccines = vaxDifficulty[1];
            independentOutbreaks = independentOutbreakDifficulty[1];
            transmissionRate = transmissionDifficulty[1];
            recoveryRate = recoveryDifficulty[1];
        }
        if (difficulty == "hard") {
            index = 2;
            numberOfRefusers = refuserDifficulty[2];
            numberOfVaccines = vaxDifficulty[2];
            independentOutbreaks = independentOutbreakDifficulty[2];
            transmissionRate = transmissionDifficulty[2];
            recoveryRate = recoveryDifficulty[2];
        }
    }

    //  print the constants out for troubleshooting down the road
    console.log("difficulty: " + difficulty)
    console.log("refuser count: " + numberOfRefusers)
    console.log("vax count: " + numberOfVaccines)
    console.log("outbreak count: " + independentOutbreaks)
    console.log("transmission rate: " + transmissionRate)
    console.log("recovery rate: " + recoveryRate)
    console.log("speed mode: " + speed)


    // save the constants as a JSON cookie for access on the game page
    $.cookie.json = true;
    var currentGameCookie = {scenario: scenarioTitle, difficulty: difficulty, speedMode:speed, refusers: numberOfRefusers, vax: numberOfVaccines, outbreaks: independentOutbreaks, transmissionRate: transmissionRate, recoveryRate: recoveryRate}
    $.cookie('vaxCurrentGame', JSON.stringify(currentGameCookie), { expires: 365, path: '/' })
    console.log($.cookie('vaxCurrentGame'))


}





