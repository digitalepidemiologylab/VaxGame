// menu variables
var scenarioTitle;
var noGuarantee;
var scenarioUnlockCost = 50;
var difficultyUnlockCost = 10;

// game constant arrays
var networkSize;
var vaxDifficulty;
var transmissionDifficulty;
var recoveryDifficulty;
var independentOutbreakDifficulty;
var refuserDifficulty;
var difficultyIndex;

// cookies
var unlocks;
var saves;
var scores;
var unlockRequirement = 50;

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
    $( "#scenarioAccordion" ).accordion();
    });
$( "#scenarioAccordion" ).accordion({ heightStyle: "content" });

window.setTimeout(checkUnlockables, 200);


// vax logo, top left
d3.select("body").append("div")
    .attr("class", "scenarioVaxLogoDiv")
    .text("VAX!")
    .style("cursor", "pointer")
    .on("click", function() {
        window.location.href = '/'
    })

// saves icon, below vax logo
var savesDiv = d3.select("body").append("div")
    .attr("class", "scenarioSavesDiv")
    .text("Saves")
    .style("cursor", "pointer")

savesDiv.append("svg")
    .attr("height", "105px")
    .attr("width", "100px")
    .attr("class", "savesSVG")
    .style("background", "inherit")


var savesIcon = d3.select(".savesSVG").selectAll("image").data([0]);

savesIcon.enter()
    .append("image")
    .attr("xlink:href", "/img/savesIcon.svg")
    .attr("x", "-24")
    .attr("y", "-12")
    .style("position", "absolute")
    .attr("width", "150%")
    .attr("height", "100%")
    .attr("class", "savesIcon")

// scenario title above jquery-ui accordion
d3.select("body").append("div")
    .attr("class", "scenarioTitle")
    .text("Scenarios")
    .style("position", "absolute")
    .style("top", "107px")
    .style("left", "250px")
    .style("font-family", "Nunito")
    .style("font-size", "32px")
    .style("font-weight", "400")
    .style("color" , "#707070")


function selectScenario(difficulty) {
    noGuarantee = true;
    // when called, it will record the current active header title (scenario title)
    scenarioTitle = $(".ui-accordion-header-active").text();

    // conditional statements determine which scenario we're in and which constant to choose, given difficulty input
    // graph is then drawn to spec
    defineDifficultyConstants();

    // now that the difficulty values have been chosen based on scenario, we set them based on difficulty
    setDifficultyConstants(scenarioTitle, difficulty);


    // remove accordion & title + move logo down

    d3.select("#scenarioAccordion").remove()
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
            window.location.href = '/scenario'
        })

    window.setTimeout(function() {window.location.href = '/scenarioGame'}, 500)
}

function createUnlocksCookie() {
    // object of unlocks for first scenario & random
    var initial = {easy: true, medium: false, hard:false};
    // object of unlocks for all the rest
    var locked = {easy: false, medium: false, hard:false};


    // unlocks object, to be strified into JSON cookie
    var unlocks = {work: {difficulty: locked}, theater: {difficulty:locked}, restaurant: {difficulty:locked}, club:  {difficulty:locked}, shop:  {difficulty:locked}, original:  {difficulty:initial}}

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

    checkSavesCookie();
    checkScoresCookie();

}

function checkScoresCookie() {
    $.cookie.json = true;
    scores = $.cookie('vaxScores')
    if (scores == undefined) createScoresCookie();
    else postHighScores();

}

function postHighScores() {


    // this will read the high scores cookie and write the relevant hiScore next-to/below/whatevs the easy/med/hard text

}

function createScoresCookie() {
    // create empty score array
    var emptyScoreArray = [];

    // create an object that differentiates between real time and turn-based
    var emptyScoreObject = {
        realTime: {easy:emptyScoreArray, medium:emptyScoreArray, hard:emptyScoreArray},
        turnBased: {easy:emptyScoreArray, medium:emptyScoreArray, hard:emptyScoreArray}
    }

    // create the master object that is separated by scenario
    var scenarioScores = {
        work: emptyScoreObject,
        theater: emptyScoreObject,
        restaurant: emptyScoreObject,
        club: emptyScoreObject,
        shop: emptyScoreObject,
        original: emptyScoreObject
    }

    // write the cookie
    $.cookie.json = true;
    var stringifiedScores = JSON.stringify(scenarioScores);
    $.cookie('vaxScores', stringifiedScores, { expires: 365, path: '/' })
}

function checkSavesCookie() {
    saves = $.cookie('vaxSaves')
    if (saves == undefined) {
        var initSaves = 0;
        $.cookie('vaxSaves', initSaves, { expires: 365, path: '/' })
    }
    d3.selectAll(".savesText").remove();
    d3.select(".savesSVG").append("text")
        .attr("class", "savesText")
        .attr("x", function() {
            var string = "x" + saves;
            var xPosition;
            if (string.length == 2) xPosition = "39px";
            if (string.length == 3) xPosition = "33px";
            if (string.length == 4) xPosition = "26px";
            if (string.length == 5) xPosition = "21px";
            if (string.length == 6) xPosition = "16px";
            if (string.length == 7) xPosition = "13px";
            return xPosition                          ;
        })
        .attr("y", "95px")
        .text("x" + saves)
}

function modifyMenuByUnlocks() {
    drawLocks();
    disableDropdowns();
}

function disableDropdowns() {
    if (unlocks.work.difficulty.easy == false) {
        $("#work").addClass( "ui-state-disabled" );
        d3.selectAll(".workLockIcon").attr("opacity", 1)
    }
    else {
        d3.selectAll(".workLockIcon").attr("opacity", 0)
        $("#work").removeClass( "ui-state-disabled" );

    }

    if (unlocks.theater.difficulty.easy == false) {
        $("#theater").addClass( "ui-state-disabled" );
        d3.selectAll(".theaterLockIcon").attr("opacity", 1)

    }
    else {
        d3.selectAll(".theaterLockIcon").attr("opacity", 0)
        $("#theater").removeClass( "ui-state-disabled" );
    }


    if (unlocks.restaurant.difficulty.easy == false) {
        $("#restaurant").addClass( "ui-state-disabled" );
        d3.selectAll(".restaurantLockIcon").attr("opacity", 1)

    }
    else {
        d3.selectAll(".restaurantLockIcon").attr("opacity", 0)
        $("#restaurant").removeClass( "ui-state-disabled" );
    }


    if (unlocks.club.difficulty.easy == false) {
        $("#club").addClass( "ui-state-disabled" );
        d3.selectAll(".clubLockIcon").attr("opacity", 1)
    }
    else {
        d3.selectAll(".clubLockIcon").attr("opacity", 0)
        $("#club").removeClass( "ui-state-disabled" );

    }


    if (unlocks.shop.difficulty.easy == false) {
        $("#shop").addClass( "ui-state-disabled" );
        d3.selectAll(".shopLockIcon").attr("opacity", 1)
    }
    else {
        d3.selectAll(".shopLockIcon").attr("opacity", 0)
        $("#shop").removeClass( "ui-state-disabled" );

    }

    if (unlocks.original.difficulty.easy == false) {
        $("#original").addClass( "ui-state-disabled" );
        d3.selectAll(".originalLockIcon").attr("opacity", 1)

    }
    else {
        d3.selectAll(".originalLockIcon").attr("opacity", 0)
        $("#original").removeClass( "ui-state-disabled" );

    }


}


function setDifficultyConstants(scenarioTitle, difficulty) {
    var index;

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

var buttonsDrawn = false;

window.setTimeout(function() {
    drawButtons();
    checkUnlockables();
}, 100)

function drawButtons() {
    $.cookie.json = true;
    unlocks = $.cookie('vaxUnlocks')

    if (buttonsDrawn) return;
    else {
        buttonsDrawn = true;

        d3.select("#workAction").append("svg")
            .attr("id", "workSVG")

        d3.select("#theaterAction").append("svg")
            .attr("id", "theaterSVG")

        d3.select("#restaurantAction").append("svg")
            .attr("id", "restaurantSVG")

        d3.select("#clubAction").append("svg")
            .attr("id", "clubSVG")

        d3.select("#shopAction").append("svg")
            .attr("id", "shopSVG")

        d3.select("#originalAction").append("svg")
            .attr("id", "originalSVG")

        ///// work
        //easy
        d3.selectAll("#workSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "workEasy")
            .attr("x", 60)
            .attr("y", 50)
            .text("Easy")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.work.difficulty.easy) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("easy")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
            })
            .on("click", function() {
                selectScenario("easy")
            });

        //medium
        d3.selectAll("#workSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "workMedium")
            .attr("x", 60)
            .attr("y", 125)
            .text("Medium")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.work.difficulty.medium) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("medium")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.work.difficulty.medium) {
                    verifyUnlock("workMedium")
                    return;
                }
                else selectScenario("medium")
            });

        //hard
        d3.selectAll("#workSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "workHard")
            .attr("x", 60)
            .attr("y", 200)
            .text("Hard")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.work.difficulty.hard) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("hard")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.work.difficulty.hard) {
                    verifyUnlock("workHard")
                    return;
                }
                else selectScenario("hard")
            });
        ////theater
        //easy
        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "theaterEasy")
            .attr("x", 60)
            .attr("y", 50)
            .text("Easy")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.theater.difficulty.easy) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("easy")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
            })
            .on("click", function() {selectScenario("easy")});

        //medium
        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "theaterMedium")
            .attr("x", 60)
            .attr("y", 125)
            .text("Medium")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.theater.difficulty.medium) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("medium")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
            })
            .on("click", function() {
                if (!unlocks.theater.difficulty.medium) {
                    verifyUnlock("theaterMedium")
                }
                else selectScenario("medium")
            });
        //hard
        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "theaterHard")
            .attr("x", 60)
            .attr("y", 200)
            .text("Hard")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.theater.difficulty.hard) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("hard")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.theater.difficulty.hard) {
                    verifyUnlock("theaterHard")
                }
                else selectScenario("hard")
            });
        //// restaurant
        //easy
        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "restaurantEasy")
            .attr("x", 60)
            .attr("y", 50)
            .text("Easy")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.restaurant.difficulty.easy) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("easy")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {selectScenario("easy")});
        //medium
        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "restaurantMedium")
            .attr("x", 60)
            .attr("y", 125)
            .text("Medium")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.restaurant.difficulty.medium) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("medium")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.restaurant.difficulty.medium) {
                    verifyUnlock("restaurantMedium")
                }
                else selectScenario("medium")
            });
        //hard
        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "restaurantHard")
            .attr("x", 60)
            .attr("y", 200)
            .text("Hard")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.restaurant.difficulty.hard) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("hard")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.restaurant.difficulty.hard) {
                    verifyUnlock("restaurantHard")
                }
                else selectScenario("hard")
            });
        ////org
        //easy
        d3.selectAll("#clubSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "clubEasy")
            .attr("x", 60)
            .attr("y", 50)
            .text("Easy")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.club.difficulty.easy) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("easy")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {selectScenario("easy")});
        //medium
        d3.selectAll("#clubSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "clubMedium")
            .attr("x", 60)
            .attr("y", 125)
            .text("Medium")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.club.difficulty.medium) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("medium")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.club.difficulty.medium) {
                    verifyUnlock("clubMedium")
                }
                else selectScenario("medium")
            });
                    //hard
        d3.selectAll("#clubSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "clubHard")
            .attr("x", 60)
            .attr("y", 200)
            .text("Hard")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.club.difficulty.hard) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("hard")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.club.difficulty.hard) {
                    verifyUnlock("clubHard")
                }
                else selectScenario("hard")
            });
        //// line
        //easy
        d3.selectAll("#shopSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "shopEasy")
            .attr("x", 60)
            .attr("y", 50)
            .text("Easy")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.shop.difficulty.easy) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("easy")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
            })
            .on("click", function() {selectScenario("easy")});
        //medium
        d3.selectAll("#shopSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "shopMedium")
            .attr("x", 60)
            .attr("y", 125)
            .text("Medium")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.shop.difficulty.medium) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("medium")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
            })
            .on("click", function() {
                if (!unlocks.shop.difficulty.medium) {
                    verifyUnlock("shopMedium")
                    return;
                }
                else selectScenario("medium")
            });
        //hard
        d3.selectAll("#shopSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "shopHard")
            .attr("x", 60)
            .attr("y", 200)
            .text("Hard")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.shop.difficulty.hard) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("hard")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove()
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
            })
            .on("click", function() {
                if (!unlocks.shop.difficulty.hard) {
                    verifyUnlock("shopHard")
                    return;
                }
                else selectScenario("hard")
            });
        //// original
        //easy
        d3.selectAll("#originalSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "originalEasy")
            .attr("x", 60)
            .attr("y", 50)
            .text("Easy")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.original.difficulty.easy) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("easy")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove();
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
            })
            .on("click", function() {selectScenario("easy")});
        //medium
        d3.selectAll("#originalSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "originalMedium")
            .attr("x", 60)
            .attr("y", 125)
            .text("Medium")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.original.difficulty.medium) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("medium")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")

            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".popoverStat").remove();
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")

            })
            .on("click", function() {
                if (!unlocks.original.difficulty.medium) {
                    verifyUnlock("originalMedium")
                    return;
                }
                else selectScenario("medium")
            });
        //hard
        d3.selectAll("#originalSVG").append("text")
            .attr("class", "difficultyButton")
            .attr("id", "originalHard")
            .attr("x", 60)
            .attr("y", 200)
            .text("Hard")
            .style("cursor", function() {
                var cursorStyle;
                if (unlocks.original.difficulty.hard) cursorStyle = "pointer"
                else cursorStyle = "no-drop";
                return cursorStyle;
            })
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
                drawDifficultyPopover("hard")
                d3.selectAll(".difficultyPopover").style("background", "#85bc99")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #838383")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
                d3.selectAll(".difficultyPopover").style("background", "#f1f1f1")
                d3.selectAll(".difficultyPopover").style("box-shadow", "5px 6px #f1f1f1")
                d3.selectAll(".popoverStat").remove();

            })
            .on("click", function() {
                if (!unlocks.original.difficulty.hard) {
                    verifyUnlock("originalHard")
                    return;
                }
                else selectScenario("hard")
            });
    }

}

function defineDifficultyConstants() {
    scenarioTitle = $(".ui-accordion-header-active").text();

    if (scenarioTitle == "Workplace / School") {
        networkSize = [87,87,87];
        vaxDifficulty = [25,18,15];
        transmissionDifficulty = [0.08, 0.10, 0.15];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,3,4];
        refuserDifficulty = [3,7,14];
    }
    if (scenarioTitle == "Movie Theater / Lecture Hall") {
        networkSize = [48,48,48];
        vaxDifficulty = [5,4,3];
        transmissionDifficulty = [0.50, 0.55, 0.55];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,3,3];
        refuserDifficulty = [2,7,9];
    }
    if (scenarioTitle == "Restaurant") {
        networkSize = [74,74,74];
        vaxDifficulty = [4,3,2];
        transmissionDifficulty = [0.55, 0.65, 0.75];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,3,4];
        refuserDifficulty = [3,5,7];
    }
    if (scenarioTitle == "Organization") {
        networkSize = [50,50,50];
        vaxDifficulty = [5,4,3];
        transmissionDifficulty = [0.45, 0.55, 0.65];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [1,2,3];
        refuserDifficulty = [2,5,7];
    }
    if (scenarioTitle == "Endless Queue") {
        networkSize = [145,145,145];
        vaxDifficulty = [20,15,10];
        transmissionDifficulty = [0.45, 0.55, 0.65];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [2,5,7];
        refuserDifficulty = [5,10,20];
    }

    if (scenarioTitle == "Random Networks") {
        networkSize = [40,60,85];
        vaxDifficulty = [5, 10, 10];
        transmissionDifficulty = [0.35, 0.50, 0.65];
        recoveryDifficulty = [0.40, 0.35, 0.30];
        independentOutbreakDifficulty = [1, 2, 3];
        refuserDifficulty = [3, 8, 10];
    }
}

function drawDifficultyPopover(difficulty) {
    defineDifficultyConstants();

    if (difficulty == "easy") difficultyIndex = 0;
    if (difficulty == "medium") difficultyIndex = 1;
    if (difficulty == "hard") difficultyIndex = 2;

    d3.selectAll(".difficultyPopover").append("text")
        .attr("class", "popoverStat")
        .attr("id", "difficultyPopoverHeader")
        .style("color", "#838383")
        .text("Difficulty Stats")

    d3.selectAll(".difficultyPopover").append("text")
        .attr("class", "popoverStat")
        .attr("id", "sizeStat")
        .text("Net Size: " + networkSize[difficultyIndex]);

    d3.selectAll(".difficultyPopover").append("text")
        .attr("class", "popoverStat")
        .attr("id", "vaxStat")
        .text("Vaccines: " + vaxDifficulty[difficultyIndex])

    d3.selectAll(".difficultyPopover").append("text")
        .attr("class", "popoverStat")
        .attr("id", "refuserStat")
        .text("Refusers: " + refuserDifficulty[difficultyIndex])

    d3.selectAll(".difficultyPopover").append("text")
        .attr("class", "popoverStat")
        .attr("id", "outbreakStat")
        .text("Outbreak: " + independentOutbreakDifficulty[difficultyIndex])


//    d3.select(".difficultyPopover").append("text")
//        .attr("class", "popoverStat")
//        .attr("id", "transmissionStat")
//        .text("Infect: " + transmissionDifficulty[difficultyIndex] * 100 + "%")
//
//    d3.select(".difficultyPopover").append("text")
//        .attr("class", "popoverStat")
//        .attr("id", "recoveryStat")
//        .text("Cure: " + recoveryDifficulty[difficultyIndex] * 100 + "%")
//


}



function verifyUnlock(selectedLock) {
    var unlockRequirement;
    // set unlock requirement based on selected locked item (scenario or difficulty)
    if (selectedLock.indexOf("Medium") == -1 && selectedLock.indexOf("Hard") == -1) unlockRequirement = 50;
    else unlockRequirement = 10;
    if (saves <= unlockRequirement) return;

    saves = $.cookie('vaxSaves');
    unlocks = $.cookie('vaxUnlocks');

    d3.select("body").append("div")
        .attr("class","verifyUnlockBox")

    d3.select(".verifyUnlockBox").transition().duration(200).style("top", "150px")

    d3.select(".verifyUnlockBox").append("text")
        .attr("class", "verifyUnlockHeader")
        .text("Unlock Scenario?")

    d3.select(".verifyUnlockBox").append("text")
        .attr("class", "verifyUnlockCost")
        .style("color", "#2692f2")
        .text("(Costs " + unlockRequirement + " Saves)")

    d3.select(".verifyUnlockBox").append("text")
        .attr("class", "verifyUnlockYes")
        .text("Yes")
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692f2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "white")
        })
        .on("click", function() {

            if (selectedLock == "work") {
                unlocks.work.difficulty.easy = true;
                saves -= scenarioUnlockCost;

            }
            if (selectedLock == "theater") {
                unlocks.theater.difficulty.easy = true;
                saves -= scenarioUnlockCost;
            }
            if (selectedLock == "restaurant") {
                unlocks.restaurant.difficulty.easy = true;
                saves -= scenarioUnlockCost;
            }
            if (selectedLock == "club") {
                unlocks.club.difficulty.easy = true;
                saves -= scenarioUnlockCost;
            }
            if (selectedLock == "shop") {
                unlocks.shop.difficulty.easy = true;
                saves -= scenarioUnlockCost;
            }
            if (selectedLock == "original") {
                unlocks.original.difficulty.easy = true;
                saves -= scenarioUnlockCost;
            }


            if (selectedLock == "workMedium") {
                unlocks.work.difficulty.medium = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "theaterMedium") {
                unlocks.theater.difficulty.medium = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "restaurantMedium") {
                unlocks.restaurant.difficulty.medium = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "clubMedium") {
                unlocks.club.difficulty.medium = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "shopMedium") {
                unlocks.shop.difficulty.medium = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "originalMedium") {
                unlocks.original.difficulty.medium = true;
                saves -= difficultyUnlockCost;
            }


            if (selectedLock == "workHard") {
                unlocks.work.difficulty.hard = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "theaterHard") {
                unlocks.theater.difficulty.hard = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "restaurantHard") {
                unlocks.restaurant.difficulty.hard = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "clubHard") {
                unlocks.club.difficulty.hard = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "shopHard") {
                unlocks.shop.difficulty.hard = true;
                saves -= difficultyUnlockCost;
            }
            if (selectedLock == "originalHard") {
                unlocks.original.difficulty.hard = true;
                saves -= difficultyUnlockCost;
            }

            d3.select(".verifyUnlockBox").style("top", "-300px")
            window.setTimeout(function() {d3.select('.verifyUnlockBox').remove()}, 200)

            d3.selectAll(".savesText").remove();

            d3.select(".savesSVG").append("text")
                .attr("class", "savesText")
                .attr("x", function() {
                    var string = "x" + saves;
                    var xPosition;
                    if (string.length == 2) xPosition = "39px";
                    if (string.length == 3) xPosition = "33px";
                    if (string.length == 4) xPosition = "26px";
                    if (string.length == 5) xPosition = "21px";
                    if (string.length == 6) xPosition = "16px";
                    if (string.length == 7) xPosition = "13px";


                    return xPosition;
                })
                .attr("y", "95px")
                .text("x" + saves)

            $.removeCookie('vaxSaves')
            $.removeCookie('vaxUnlocks')

            $.cookie('vaxSaves', saves, { expires: 365, path: '/' })
            $.cookie('vaxUnlocks', unlocks, { expires: 365, path: '/' })

            saves = $.cookie('vaxSaves')
            unlocks = $.cookie('vaxUnlocks');


            d3.selectAll(".difficultyButton").remove();
            buttonsDrawn = false;
            drawButtons();

            disableDropdowns();


        })

    d3.select(".verifyUnlockBox").append("text")
        .attr("class", "verifyUnlockNo")
        .text("No")
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "white")
        })
        .on("click", function() {
            d3.select(".verifyUnlockBox").style("top", "-300px")
            window.setTimeout(function() {d3.select('.verifyUnlockBox').remove()}, 200)

        })





}

function drawLocks() {

    var workSVG = d3.select("#work").append("svg")
        .attr("class", "lock")
        .attr("id", "workLock")
        .style("background", "inherit")

    var workLockIcon = workSVG.selectAll("image").data([0]);
    workLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/img/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .attr("width", "50")
        .attr("height", "50")
        .attr("class", "workLockIcon")
        .style("position", "absolute")
        .style("left", "0")
        .style("cursor", "pointer")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "work";
            verifyUnlock(selectedLock);
        })


    var theaterSVG = d3.select("#theater").append("svg")
        .attr("class", "lock")
        .attr("id", "theaterLock")
        .style("background", "inherit")

    var theaterLockIcon = theaterSVG.selectAll("image").data([0]);
    theaterLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/img/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .style("cursor", "pointer")
        .attr("class", "theaterLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "theater";
            verifyUnlock(selectedLock);

        })



    var restaurantSVG = d3.select("#restaurant").append("svg")
        .attr("class", "lock")
        .attr("id", "restaurantLock")
        .style("background", "inherit")

    var restaurantLockIcon = restaurantSVG.selectAll("image").data([0]);
    restaurantLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/img/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .style("cursor", "pointer")
        .attr("class", "restaurantLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "restaurant";
            verifyUnlock(selectedLock);
        })




    var clubSVG = d3.select("#club").append("svg")
        .attr("class", "lock")
        .attr("id", "restaurantLock")
        .style("background", "inherit")

    var clubLockIcon = clubSVG.selectAll("image").data([0]);
    clubLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/img/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .style("cursor", "pointer")
        .attr("class", "clubLockIcon")
        .style("cursor", "pointer")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "club";
            verifyUnlock(selectedLock);

        })

    var shopSVG = d3.select("#shop").append("svg")
        .attr("class", "lock")
        .attr("id", "shopLock")
        .style("background", "inherit")

    var shopLockIcon = shopSVG.selectAll("image").data([0]);
    shopLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/img/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .style("cursor", "pointer")
        .attr("class", "shopLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "shop";
            verifyUnlock(selectedLock);

        })





    var originalSVG = d3.select("#original").append("svg")
        .attr("class", "lock")
        .attr("id", "originalLock")
        .style("background", "inherit")

    var originalLockIcon = originalSVG.selectAll("image").data([0]);
    originalLockIcon.enter()
        .append("image")
        .attr("xlink:href", "/img/lockIcon.svg")
        .attr("x", "-10")
        .attr("y", "-10")
        .style("position", "absolute")
        .style("left", "0")
        .attr("width", "50")
        .attr("height", "50")
        .style("cursor", "pointer")
        .attr("class", "originalLockIcon")
        .on("mouseover", function() {
            // pop-over showing the cost of the unlock
        })
        .on("click", function() {
            var selectedLock = "original";
            verifyUnlock(selectedLock);

        })



}
