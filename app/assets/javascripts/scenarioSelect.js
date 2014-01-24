// menu variables
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
    var scenarios = [unlocks.work, unlocks.theater, unlocks.restaurant, unlocks.club, unlocks.shop, unlocks.original]
    var easyTexts = [".workEasy", ".theaterEasy", ".restaurantEasy", ".clubEasy", "shopEasy", ".originalEasy"]
    var mediumTexts = [".workMedium", ".theaterMedium", ".restaurantMedium", ".clubMedium", "shopMedium", ".originalMedium"]
    var hardTexts = [".workHard", ".theaterHard", ".restaurantHard", ".clubHard", "shopHard", ".originalHard"]


    for (var i = 0; i < easyTexts.length; i++) {
        if (scenarios[i].difficulty.easy == false) {
            d3.select(easyTexts[i])
                .style("cursor", "no-drop")
                .on("mouseover", function() {
                     d3.select(this).style("fill", "#707070")
                }
            )
        }
    }

    for (var i = 0; i < mediumTexts.length; i++) {
        if (scenarios[i].difficulty.medium == false) {
            d3.select(mediumTexts[i])
                .style("cursor", "no-drop")
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#707070")
                }
            )
        }
    }

    for (var i = 0; i < hardTexts.length; i++) {
        if (scenarios[i].difficulty.hard == false) {
            d3.select(hardTexts[i])
                .style("cursor", "no-drop")
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#707070")
                }
            )
        }
    }
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

var buttonsDrawn = false;

window.setTimeout(function() {drawButtons()}, 100)

function drawButtons() {
    if (buttonsDrawn) return;
    else {
        buttonsDrawn = true;
        d3.select("#workAction").append("svg")
            .attr("id", "workSVG")

        d3.selectAll("#workSVG").append("text")
            .attr("class", "workEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#workSVG").append("text")
            .attr("class", "workMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#workSVG").append("text")
            .attr("class", "workHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});




        d3.select("#theaterAction").append("svg")
            .attr("id", "theaterSVG")

        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "theaterEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "theaterMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#theaterSVG").append("text")
            .attr("class", "theaterHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#restaurantAction").append("svg")
            .attr("id", "restaurantSVG")

        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "restaurantEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "restaurantMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#restaurantSVG").append("text")
            .attr("class", "restaurantHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#clubAction").append("svg")
            .attr("id", "clubSVG")

        d3.selectAll("#clubSVG").append("text")
            .attr("class", "clubEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#clubSVG").append("text")
            .attr("class", "clubMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#clubSVG").append("text")
            .attr("class", "clubHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#shopAction").append("svg")
            .attr("id", "shopSVG")

        d3.selectAll("#shopSVG").append("text")
            .attr("class", "shopEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#shopSVG").append("text")
            .attr("class", "shopMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#shopSVG").append("text")
            .attr("class", "shopHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});


        d3.select("#originalAction").append("svg")
            .attr("id", "originalSVG")

        d3.selectAll("#originalSVG").append("text")
            .attr("class", "originalEasy")
            .attr("x", 0)
            .attr("y", 25)
            .text("Easy")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("easy")});

        d3.selectAll("#originalSVG").append("text")
            .attr("class", "originalMedium")
            .attr("x", 200)
            .attr("y", 25)
            .text("Medium")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("medium")});

        d3.selectAll("#originalSVG").append("text")
            .attr("class", "originalHard")
            .attr("x", 425)
            .attr("y", 25)
            .text("Hard")
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })
            .on("click", function() {selectScenario("hard")});
    }
}


