var numberOfIndividuals, meanDegree, rewire = 0.1;
var graph = {};
var force,node, link;
var scenarioTitle;

var resizingParameter = 2;
var invisibleParameter = 1.9;

var transmissionRate,recoveryRate;
var transmissionRates = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
var recoveryRates = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
var independentOutbreaks = 1;

var numberVaccinated;
var numberQuarantined;
var numberSaved;
var numberInfected;
var numberOfRefusers;

var gameSVG ;
var width = 925;
var height = 750 - 45 - 50;  // standard height - footer:height - footer:bottomMargin
var charge = -900;
var friction = 0.9;

var numberOfVaccines = 0;
var vaccineSupply = 0;

var difficultyString;
var customNodeChoice;
var customNeighborChoice;
var customVaccineChoice;
var customOutbreakChoice;
var customRefuserChoice;

var timestep = 0;
var newInfections = [];
var exposureEdges = [];
var xyCoords = [];
var diseaseIsSpreading = false;
var timeToStop = false;

var infectedBar;
var uninfectedBar;
var infectedHeight;
var uninfectedHeight;

var game;

var easyBar = 70;
var mediumBar = 50;
var hardBar = 40;

var vaxEasyCompletion;
var vaxMediumCompletion;
var vaxHardCompletion;

var vaxEasyHiScore;
var vaxMediumHiScore;
var vaxHardHiScore;

var vaxEasyHiScoreRT;
var vaxMediumHiScoreRT;
var vaxHardHiScoreRT;

var easyScores;
var mediumScores;
var hardScores;
var scores = {easy: easyScores, medium: mediumScores, hard: hardScores};

var easyScoresRT;
var mediumScoresRT;
var hardScoresRT;
var scoresRT = {easy: easyScoresRT, medium: mediumScoresRT, hard: hardScoresRT};

var currentNode;
var currentElement;

var cookie = {};
var pop;

var best;
var current;

// fine tuning the drag versus click differentiation
var originalLocation = [0,0];
var newLocation = [0,0];
var dragStartDateObject;
var dragStartMillis;
var dragEndDateObject;
var dragEndMillis;
var clickTime;
var dragDistanceThreshold = 10;
var clickTimeThreshold = 100;


initBasicMenu();
window.setTimeout(initCookiesOnDelay, 500);

function initCookiesOnDelay() {
    readCookiesJSON();
}

function initSocialShare() {
    if (vaxHardHiScore < 0) return;

    var twitterText;
    var facebookText;

    twitterText = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2F.vax.herokuapp.com&text=I just stopped an epidemic in its tracks! Can you can beat my high scores? Easy: " + vaxEasyHiScore + "%25 %7C Medium: " + vaxMediumHiScore + "%25 %7C Hard: " + vaxHardHiScore + "%25. vax.herokuapp.com";
    facebookText = "http://www.facebook.com/sharer.php?s=100&p[title]=Vax! | Gamifying Epidemic Prevention&p[summary]=I just stopped an epidemic in its tracks! Can you beat my high scores? Easy: " + vaxEasyHiScore + "% | Medium: " + vaxMediumHiScore + "% | Hard: " + vaxHardHiScore + "%.&p[url]=http://vax.herokuapp.com";

    d3.select(".difficultySelection").append("svg")
        .attr("class", "socialShareMain")
        .style("left", "300px")
        .style("top", "300px")
        .style("width", "300px")
        .style("height", "200px")

    d3.select(".socialShareMain").append("text")
        .attr("x", 0)
        .attr("y", 70)
        .style("font-family", "Nunito")
        .style("font-size", "25px")
        .style("font-weight", "300")
        .style("fill", "#707070")
        .style("cursor", "pointer")
        .text("Share All ▾")
        .on("click", function() {
            d3.selectAll(".shareIcon")
                .transition()
                .duration(500)
                .attr("opacity", 1)
        })


    d3.select(".socialShareMain").append("image")
        .attr("class", "shareIcon")
        .attr("x", 25)
        .attr("y", 100)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/facebook_icon.png")
        .attr("id", "facebook")
        .style("cursor", "pointer")
        .attr("opacity", 0)
        .on("click", function() {
            window.location.href = facebookText;
        })



    d3.select(".socialShareMain").append("image")
        .attr("class", "shareIcon")
        .attr("x", 100)
        .attr("y", 100)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/twitter_icon.png")
        .attr("id", "twitter")
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = twitterText;
        })

    d3.select(".socialShareMain").append("image")
        .attr("class", "shareIcon")
        .attr("x", 175)
        .attr("y", 100)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/googleplus_icon.png")
        .attr("id", "twitter")
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = "https://plus.google.com/share?url=http://vax.herokuapp.com";
        })
}

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

function clearCookies() {
    $.removeCookie('vaxCookie')

    $.removeCookie('customNodes')
    $.removeCookie('customNeighbors')
    $.removeCookie('customVaccines')
    $.removeCookie('customOutbreaks')
    $.removeCookie('customRefusers')


    //old cookie clearing
    $.removeCookie('vaxEasyCompletion')
    $.removeCookie('vaxMediumCompletion')
    $.removeCookie('vaxHardCompletion')

    $.removeCookie('vaxEasyHiScore')
    $.removeCookie('vaxMediumHiScore')
    $.removeCookie('vaxHardHiScore')

}

function allAccess() {
    $.cookie.json = true;
    easyScores = ["99"];
    mediumScores = ["99"];
    hardScores = ["99"];
    var score = [easyScores, mediumScores, hardScores];

    easyScoresRT = ["99"];
    mediumScoresRT = ["99"];
    hardScoresRT = ["99"];
    var scoreRT = [easyScoresRT, mediumScoresRT, hardScoresRT];

    var cookie = {easy: true, medium: true, hard: true, scores: score, scoresRT: scoreRT}
    $.removeCookie('vaxCookie')
    $.cookie('vaxCookie', JSON.stringify(cookie), { expires: 365, path: '/' })

}


function cookieBasedModeSelection() {

    if (vaxEasyHiScore == -Infinity) {}
    else {

        if (speed) {
            d3.select(".easyHi")
                .text("(Best: " + vaxEasyHiScoreRT + "%)")

        }
        else {
            d3.select(".easyHi")
                .text("(Best: " + vaxEasyHiScore + "%)")

        }

    }

    if (vaxMediumHiScore == -Infinity) {}
    else {
        if (speed) {
            d3.select(".mediumHi")
                .text("(Best: " + vaxMediumHiScoreRT + "%)")

        }
        else {
            d3.select(".mediumHi")
                .text("(Best: " + vaxMediumHiScore + "%)")

        }

    }

    if (vaxHardHiScore == -Infinity) {}
    else {
        if (speed) {
            d3.select(".hardHi")
                .text("(Best: " + vaxHardHiScoreRT + "%)")

        }
        else {
            d3.select(".hardHi")
                .text("(Best: " + vaxHardHiScore + "%)")

        }

    }



    d3.select("#difficultyEasy")
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "#707070")
        })

    // set medium based on easy
    if (vaxEasyCompletion == true) {
        d3.select("#difficultyMedium")
            .attr("class", "difficultyItem")
            .on("mouseover", function() {
                d3.select(this).style("color", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("color", "#707070")
            })
            .on("click", function() {
                difficultyString = "medium";
                initBasicGame(difficultyString)
            });
    }
    else {
        d3.select("#difficultyMedium")
            .attr("class", "difficultyItemGrey")
            .on("mouseover", function() {})
            .on("mouseout", function() {})
            .on("click", function() {})
    }

    // set hard based on medium
    if (vaxMediumCompletion == true) {
        d3.select("#difficultyHard")
            .attr("class", "difficultyItem")
            .on("mouseover", function() {
                d3.select(this).style("color", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("color", "#707070")
            })
            .on("click", function() {
                difficultyString = "hard";
                initBasicGame(difficultyString)
            });
    }
    else {
        d3.select("#difficultyHard")
            .attr("class", "difficultyItemGrey")
            .on("mouseover", function() {})
            .on("mouseout", function() {})
            .on("click", function() {})
    }

    // set custom based on hard
    if (vaxHardCompletion == true) {
        d3.select("#difficultyCustom")
            .attr("class", "difficultyItem")
            .on("mouseover", function() {
                d3.select(this).style("color", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("color", "#707070")
            })
            .on("click", function() {
                d3.select(".difficultySelection").remove()
                initCustomMenu();
            });

    }
    else {
        d3.select("#difficultyCustom")
            .attr("class", "difficultyItemGrey")
            .on("mouseover", function() {})
            .on("mouseout", function() {})
            .on("click", function() {})
    }
}


function initBasicGame(difficulty) {
    d3.select(".difficultySelection").remove();
    d3.select(".difficultySelection").remove();
    d3.select(".newGameHeader").remove();
    d3.select("#customMenuDiv").remove();

    graph             = {}    ;
    graph.nodes       = []    ;
    graph.links       = []    ;

    if (difficulty == "easy") {
        numberOfIndividuals = 50;
        meanDegree = 3;
        numberOfVaccines = 5;
        independentOutbreaks = 1;
        transmissionRate = transmissionRates[7];
        recoveryRate = recoveryRates[0];
    }

    if (difficulty == "medium") {
        numberOfIndividuals = 75;
        meanDegree = 4;
        numberOfVaccines = 7;
        independentOutbreaks = 2;
        transmissionRate = transmissionRates[7];
        recoveryRate = recoveryRates[0];
    }

    if (difficulty == "hard") {
        charge = -300;
        numberOfIndividuals = 100;
        meanDegree = 4;
        numberOfVaccines = 15;
        transmissionRate = transmissionRates[4];
        recoveryRate = recoveryRates[0];
        independentOutbreaks = 3;
    }

    graph = generateSmallWorld(numberOfIndividuals, rewire, meanDegree);

    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].fixed = false;
    }

    if (difficulty == "hard") {
        for (var i = 0; i < graph.nodes.length; i++) {
            if (Math.random() < 0.05) graph.nodes[i].refuser = true;
        }
    }

    removeDuplicateEdges(graph);
    initGameSpace();

}

function initCustomGame() {
    d3.select(".vaxLogoDiv").remove();

    scenarioTitle = "custom";
    difficultyString = null;

    d3.select(".newGameHeader").remove();
    graph             = {}    ;
    graph.nodes       = []    ;
    graph.links       = []    ;

    transmissionRate = 0.50;

    numberOfIndividuals = customNodeChoice;
    meanDegree = customNeighborChoice;
    numberOfVaccines = customVaccineChoice;
    vaccineSupply = numberOfVaccines;
    independentOutbreaks = customOutbreakChoice;
    numberOfRefusers = customRefuserChoice;

    if (numberOfVaccines == 0) numberOfVaccines = 1;
    if (independentOutbreaks < (numberOfIndividuals - numberOfVaccines)) independentOutbreaks = 1;

    if (customNodeChoice > 100) charge = -150;
    if (customNodeChoice > 125) charge = -130;

    graph = generateSmallWorld(numberOfIndividuals, rewire, meanDegree);
    removeDuplicateEdges(graph);

    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].refuser = false;
    }

    for (var i = 0; i < numberOfRefusers; i++) {
        do {
            var node = graph.nodes[Math.floor(Math.random() * graph.nodes.length)]
        }
        while (node.refuser)
        node.refuser = true;
    }

    // prevent all nodes from being refusers and halting the game
    var refuserCount = 0;
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].refuser) refuserCount++;
    }

    if (refuserCount == numberOfIndividuals) {
        numberOfVaccines = 1;
        graph.nodes[0].refuser = false;
    }


    d3.select("#customMenuDiv").style("right", "-1000px").style("visibility", "hidden")

    window.setTimeout(function() {
        d3.select("#customMenuDiv").remove()
        initGameSpace();
    }, 500);

}

function initGameSpace() {
    d3.select(".vaxLogoDiv").remove();

    pop = document.getElementById('audio');
    game = true;

    loadGameSyringe();
    initFooter();
    window.setTimeout(function() {d3.select(".gameMenuBox").style("right", "0px"); d3.select(".gameVaxLogoDiv").style("left", "-12px")},1)



    vaccinateMode     = false ;
    quarantineMode    = false ;
    numberVaccinated  = 0     ;
    numberQuarantined = 0     ;

    gameSVG = d3.select("body").append("svg")
        .attr({
            "width": window.innerWidth - 135,
            "height": window.innerHeight
        })
        .attr("viewBox", "0 0 " + width + " " + height )
        .attr("class", "gameSVG")
        .attr("pointer-events", "all")
        .style("margin-left", 135)
        .append('svg:g');

    $(window).resize(function() {
        gameSVG.attr({
            "width": window.innerWidth - 135,
            "height": window.innerHeight
        })
    });

    // initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
    force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .size([width, height])
        .charge(charge)
        .friction(friction)
        .on("tick", tick)
        .start();

// associate empty SVGs with link data. assign attributes.
    link = gameSVG.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.

    clickArea = gameSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "clickArea")
        .attr("r", function(node) {
            var clickAreaSize;

            if (difficultyString == "easy") clickAreaSize = (invisibleParameter) * nodeSize(node);

            if (difficultyString == "medium") clickAreaSize = (invisibleParameter-0.2) * nodeSize(node);

            if (difficultyString == "hard") clickAreaSize = (invisibleParameter-0.3) * nodeSize(node);

            return clickAreaSize;
        })
        .attr("fill", "black")
        .attr("opacity", 0)
        .on("click", function(node) {
            if (speed) speedModeGameClick(node);
            else gameClick(node);
        })
        .call(d3.behavior.drag()
            .on("dragstart", function(node) {
                dragStartDateObject = {};
                dragStartMillis = 0;
                dragEndMillis = 0;
                clickTime = 10000;
                dragStartDateObject = new Date();
                dragStartMillis = dragStartDateObject.getMilliseconds();
                originalLocation = [];
                newLocation = [];




                originalLocation[0] = node.x;
                originalLocation[1] = node.y;
                node.fixed = true;

            })
            .on("drag", function(node) {
                node.px += d3.event.dx;
                node.py += d3.event.dy;
                node.x += d3.event.dx;
                node.y += d3.event.dy;
                tick();

                newLocation[0] = node.x;
                newLocation[1] = node.y;

            })
            .on("dragend", function(node) {
                dragEndDateObject = new Date();
                dragEndMillis = dragEndDateObject.getMilliseconds();
                clickTime = Math.abs(dragEndMillis - dragStartMillis);
                console.log(clickTime + "\t" + getCartesianDistance(originalLocation, newLocation))

                node.fixed = false;
                tick();
                force.resume();

                // ACCOUNT FOR MICRO-MOVEMENT DURING INTENDED CLICK
                // if dragDistance is very small
                if (getCartesianDistance(originalLocation, newLocation) < dragDistanceThreshold) {
                    // AND clickTime very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeGameClick(node);
                        else gameClick(node);
                    }
                }
                //ACCOUNT FOR LARGE-FAST MOVEMENT DURING INTENDED CLICK
                // however, if dragDistance is larger than the threshold
                else {
                    // but the clickTime is still very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeGameClick(node);
                        else gameClick(node);
                    }
                }


            })


        )

    node = gameSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", nodeSize)
        .attr("fill", nodeColor)
        .on("click", function(d) {
            if (speed) speedModeGameClick(d);
            else gameClick(d);
        })
        .on("mouseover", function(d) {
            d3.select(this).style("stroke-width","3px");
            currentNode = d;
            currentElement = d3.select(this);
        })
        .on("mouseout", function(d) {
            d3.select(this).style("stroke-width","2px")
            if (currentNode.fixed == true) d3.select(this).style("stroke-width","3px");
            currentNode = null;
            currentElement = null;
        })
        .call(d3.behavior.drag()
            .on("dragstart", function(node) {
                dragStartDateObject = {};
                dragStartMillis = 0;
                dragEndMillis = 0;
                clickTime = 10000;
                dragStartDateObject = new Date();
                dragStartMillis = dragStartDateObject.getMilliseconds();
                originalLocation = [];
                newLocation = [];




                originalLocation[0] = node.x;
                originalLocation[1] = node.y;
                node.fixed = true;

            })
            .on("drag", function(node) {
                node.px += d3.event.dx;
                node.py += d3.event.dy;
                node.x += d3.event.dx;
                node.y += d3.event.dy;
                tick();

                newLocation[0] = node.x;
                newLocation[1] = node.y;

            })
            .on("dragend", function(node) {
                dragEndDateObject = new Date();
                dragEndMillis = dragEndDateObject.getMilliseconds();
                clickTime = Math.abs(dragEndMillis - dragStartMillis);
                console.log(clickTime + "\t" + getCartesianDistance(originalLocation, newLocation))

                node.fixed = false;
                tick();
                force.resume();

                // ACCOUNT FOR MICRO-MOVEMENT DURING INTENDED CLICK
                // if dragDistance is very small
                if (getCartesianDistance(originalLocation, newLocation) < dragDistanceThreshold) {
                    // AND clickTime very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeGameClick(node);
                        else gameClick(node);
                    }
                }
                //ACCOUNT FOR LARGE-FAST MOVEMENT DURING INTENDED CLICK
                // however, if dragDistance is larger than the threshold
                else {
                    // but the clickTime is still very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeGameClick(node);
                        else gameClick(node);
                    }
                }


            })


        )

    loadHotKeyText();
    if (difficultyString == "hard") refusersPresent();
    if (difficultyString == null || numberOfRefusers>0) refusersPresent();

    d3.enter().append("rect")
        .attr("class", "background")
        .style("visibility", "hidden")
        .style("cursor", "crosshair");

    if (toggleDegree && difficultyString == "easy") {
        charge = -850;
    }
    if (toggleDegree && difficultyString == "medium") {
        charge = -450;
    }
    if (toggleDegree && difficultyString == "hard") {
        charge = -300;
    }

}

function loadHotKeyText() {
    var visible = true;

    d3.select("body").append("div")
        .attr("id", "pinNodesDiv")

    d3.select("#pinNodesDiv").append("text")
        .attr("id", "pinHeader")
        .style("color", "#2692F2")
        .text("▴ Pin Nodes ▴")
        .style("cursor", "pointer")

    d3.select("#pinNodesDiv").append("text")
        .attr("id", "pinText")
        .html("Hover and hit <b>spacebar</b> to pin.")

    d3.select("#pinNodesDiv").append("text")
        .attr("id", "unPinText")
        .html("Hover and hit <b>shift+spacebar</b> </br> to unpin.")

    d3.select("#pinNodesDiv")
        .on("click", function() {
            if (!visible) {
                d3.select("#pinNodesDiv").append("text")
                    .attr("id", "pinText")
                    .html("Hover and hit <b>spacebar</b> to pin.")

                d3.select("#pinNodesDiv").append("text")
                    .attr("id", "unPinText")
                    .html("Hover and hit <b>shift+spacebar</b> </br> to unpin.")
            }
            else {
                d3.select("#pinText").remove();
                d3.select("#unPinText").remove();
            }
            visible = !visible;

            if (visible) d3.select("#pinHeader").text("▴ Pin Nodes ▴")
            else d3.select("#pinHeader").text("▾ Pin Nodes ▾")

        });


}

function nodeSize(node) {
    var size;
    if (toggleDegree) {
        size = (findNeighbors(node).length + 1.5) * resizingParameter;
    }
    else size = 8;
    return size;
}

function nodeColor(node) {
    var color = null;
    if (node.status == "S") color = "#b7b7b7";
    if (node.status == "E") color = "#ef5555";
    if (node.status == "I") color = "#ef5555";
    if (node.status == "R") color = "#9400D3";
    if (node.status == "V") color = "#76A788";
    if (node.status == "Q") color = "#d9d678";

    if (node.status == "S" && node.refuser) {
        color = "#fab45a"
    }

    return color;
}

function gameClick(node) {


    if (vaccinateMode) {
        if (node.refuser == true) return;

        try {
            pop.play()
        }
        catch(err){

        }
        node.status = "V";
        numberOfVaccines--;
        numberVaccinated++;
    }
    else {
        if (quarantineMode && node.status == "S") {
            try {
                pop.play()
            }
            catch(err){

            }
            diseaseIsSpreading = true;
            node.status = "Q";
            numberQuarantined++;
            window.setTimeout(gameTimesteps, 500);
        }
    }

    if (numberOfVaccines == 0 && !diseaseIsSpreading) loadGameQuarantine();

    gameUpdate();

}

function speedModeGameClick(node) {
    if (vaccinateMode) {
        if (node.refuser == true) return;

        try {
            pop.play()
        }
        catch(err){

        }
        node.status = "V";
        numberOfVaccines--;
        numberVaccinated++;
    }
    else {
        if (quarantineMode && node.status == "S") {
            if (!diseaseIsSpreading) speedModeTimesteps();

            try {
                pop.play()
            }
            catch(err){

            }
            diseaseIsSpreading = true;
            node.status = "Q";
            numberQuarantined++;
        }
    }

    if (numberOfVaccines == 0 && !diseaseIsSpreading) loadGameQuarantine();

    gameUpdate();

}


// tick function, which does the physics for each individual node & link.
function tick() {
    clickArea.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 8, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min((height *.85), d.y)); });

    node.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 8, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min((height *.85), d.y)); });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

}

function countSavedGAME() {
    var counter = 0;
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == "S") counter++;
    }
    return counter;
}

function gameUpdate() {
    friction = 0.83;

    d3.select(".vaccineCounterText").text(numberOfVaccines)
    d3.select(".quarantineCounterText").text("x" + numberQuarantined)
    var nodes = removeVaccinatedNodes(graph);
    var links = removeOldLinks(graph);
    graph.links = links;
    updateCommunities();

    force
        .nodes(nodes)
        .charge(charge)
        .friction(friction)
        .links(links)
        .start();

    link = gameSVG.selectAll("line.link")
        .data(links, function(d) { return d.source.id + "-" + d.target.id;});

    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();

    // Update the nodes…
    node = gameSVG.selectAll("circle.node")
        .data(nodes, function(d) { return d.id })
        .style("fill", nodeColor)

    d3.selectAll(".node")
        .transition()
        .duration(100)
        .attr("r", nodeSize)

    d3.selectAll(".clickArea")
        .attr("fill", "black")
        .attr("opacity", 0)
        .on("click", function(node) {
            if (node.status == "V" || node.status == "Q") return;
            else {
                if (speed) speedModeGameClick(node);
                else gameClick(node);
            }
        })
        .attr("r", function(node) {
            var clickAreaSize;
            if (findNeighbors(node).length <= 1) clickAreaSize = 0;
            else {
                if (difficultyString == "easy") {
                    clickAreaSize = 1.9 * nodeSize(node);
                }
                if (difficultyString == "medium") {
                    clickAreaSize = (invisibleParameter-0.2) * nodeSize(node);
                }
                if (difficultyString == "hard") {
                    clickAreaSize = (invisibleParameter-0.3) * nodeSize(node);
                }
            }
            return clickAreaSize;
        })



    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill", nodeColor)
        .on("click", function(d) {
            if (speed) speedModeGameClick(d)
            else gameClick(d);
        })
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

}



function gameTimesteps() {
    infection();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectGameCompletion();
    if (!timeToStop) {
        animateGamePathogens_thenUpdate();
    }
    else {
        animateGamePathogens_thenUpdate();
    }
}

function speedModeTimesteps() {
    infection();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectGameCompletion();
    if (!timeToStop) {
        animateGamePathogens_thenUpdate();
        window.setTimeout(speedModeTimesteps, 1750)
    }
    else {
        animateGamePathogens_thenUpdate();
    }

}

function detectGameCompletion() {
    if (timeToStop || !diseaseIsSpreading) return

    updateCommunities();
    var numberOf_AtRisk_communities = 0;
    for (var groupIndex = 1; groupIndex < numberOfCommunities+1; groupIndex++) {
        var numberOfSusceptiblesPerGroup = 0;
        var numberOfInfectedPerGroup = 0;

        for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
            var node = graph.nodes[nodeIndex];
            if (parseFloat(node.group) != groupIndex); //do nothing
            else {
                if (node.status == "S") numberOfSusceptiblesPerGroup++;
                if (node.status == "I") numberOfInfectedPerGroup++;
                if (node.status == "E") numberOfInfectedPerGroup++;


            }
        }
        if (numberOfInfectedPerGroup > 0) {
            if (numberOfSusceptiblesPerGroup > 0) {
                numberOf_AtRisk_communities++;
            }
        }

    }

    if (numberOf_AtRisk_communities == 0 && diseaseIsSpreading) {
        diseaseIsSpreading = false;
        timeToStop = true;
        animateGamePathogens_thenUpdate();
        window.setTimeout(endGameSession, 1000)
    }

}

function animateGamePathogens_thenUpdate() {
    window.setTimeout(createGamePathogens  , 50)
    window.setTimeout(moveGamePathogens    , 100)
    window.setTimeout(popNewGameInfection  , 300)
    window.setTimeout(removeGamePathogens  , 800)
    window.setTimeout(gameUpdate           , 850)
}

function popNewGameInfection() {
    d3.selectAll(".node")
        .transition()
        .duration(500)
        .attr("r", function(d) {
            var currentSize;
            if (toggleDegree) currentSize = (findNeighbors(d).length + 1.5) * resizingParameter;
            else currentSize = 8;



            if (d.status == "I") {
                if (timestep - d.exposureTimestep == 1) return currentSize * 1.5;
                else return currentSize;
            }
            else return currentSize;
        })
}

function moveGamePathogens() {
    d3.selectAll(".pathogen")
        .sort()
        .transition()
        .duration(600)
        .attr("cx", function(d) { return d.receiverX} )
        .attr("cy", function(d) { return d.receiverY} );
}

function createGamePathogens() {
    xyCoords = getPathogen_xyCoords(newInfections);

    var pathogen = gameSVG.selectAll(".pathogen")
        .data(xyCoords)
        .enter()
        .append("circle")
        .attr("class", "pathogen")
        .attr("cx", function(d) { return d.transmitterX })
        .attr("cy", function(d) { return d.transmitterY })
        .attr("r", 4)
        .style("fill", "black")
}


function getPathogen_xyCoords(newInfections) {
    var xyCoords = [];
    var recentTransmitters = [];
    for (var i = 0; i < newInfections.length; i++) {
        recentTransmitters.push(newInfections[i].infectedBy);
        var coordString = {id: i, receiverX: newInfections[i].x, receiverY: newInfections[i].y, transmitterX: newInfections[i].infectedBy.x, transmitterY: newInfections[i].infectedBy.y}
        xyCoords.push(coordString);
    }
    return xyCoords;
}


function removeGamePathogens() {
    d3.selectAll(".node")
        .transition()
        .duration(200)
        .attr("r", 8)

    d3.selectAll(".pathogen")
        .transition()
        .duration(200)
        .style("opacity", 0)

    d3.selectAll(".pathogen").remove();
}


function gameIndexPatients() {
    quarantineMode = true;
    var indexPatientID = 0;
    while(independentOutbreaks > 0) {
        do {
            indexPatientID = Math.floor(Math.random() * graph.nodes.length);
        }
        while (graph.nodes[indexPatientID].status != "S");

        graph.nodes[indexPatientID].status = "I";
        graph.nodes[indexPatientID].infectedBy = "indexPatient";
        graph.nodes[indexPatientID].exposureTimestep = 0;
        independentOutbreaks--;

    }
    gameUpdate();
}


function loadGameSyringe() {
    d3.select(".actionVax").style("visibility", "visible");
    d3.select(".actionVax").style("right", 0);

    d3.select("#vaxShieldText").style("color", "white")

    d3.select(".actionVax").append("text")
        .attr("class", "vaccineCounterText")
        .style("font-size", "16px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("color", "white")
        .text("")
        .style("right", function() {
            if (numberOfVaccines.toString().length == 1) return "49px"
            if (numberOfVaccines.toString().length == 2) return "46px"

        })

    d3.select(".vaccineCounterText").text(numberOfVaccines)

    window.setTimeout(activateGameVaccinationMode, 100)

}

function hideGameSyringe() {
    vaccinationMode = false;
    d3.select(".actionVax").style("right", "-200px")
    d3.select(".gameSVG").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".vaccineDepressedState").style("visibility", "hidden")
}

function loadGameQuarantine() {
    if (vaccinateMode) hideGameSyringe();
    vaccinateMode = false;
    d3.select(".actionQuarantine").style("visibility", "visible");
    d3.select(".actionQuarantine").style("right", "0px");

    d3.select(".quarantineCounterText").remove()

    d3.select("#quarantineText").style("color", "white")

    d3.select(".actionQuarantine").append("text")
        .attr("class", "quarantineCounterText")
        .style("font-size", "16px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("color", "white")
        .text("")

    d3.select(".quarantineCounterText").text("x" + numberQuarantined)

    window.setTimeout(activateGameQuarantineMode, 1000);
}

function hideGameQuarantine() {
    quarantineMode = false;
    d3.select(".actionQuarantine").style("right", "-200px")
    d3.select(".gameSVG").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".quarantineDepressedState").style("visibility", "hidden")
}

function activateGameVaccinationMode() {
    vaccinateMode = true;
    d3.selectAll(".node").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".gameSVG").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".vaccineCounterText").text(numberOfVaccines);
    d3.select(".vaccineDepressedState").style("visibility", "visible")

}

function activateGameQuarantineMode() {
    vaccinateMode = false;
    quarantineMode = true;
    d3.selectAll(".node").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".gameSVG").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".quarantineDepressedState").style("visibility", "visible")

    gameIndexPatients();

    outbreakDetected();

}

function refusersPresent() {
    d3.select(".gameSVG").append("rect")
        .attr("class", "refuserNotifyShadow")
        .attr("x", window.innerWidth/4 + 62 + 5 - 50)
        .attr("y", -100)
        .attr("width", 325)
        .attr("height", 50)
        .attr("fill", "#838383")
        .attr("opacity", 1)

    d3.select(".gameSVG").append("rect")
        .attr("class", "refuserNotifyBox")
        .attr("x", window.innerWidth/4 + 62 - 50)
        .attr("y", -100)
        .attr("width", 325)
        .attr("height", 50)
        .attr("fill", "#85bc99")
        .attr("opacity", 1)

    d3.select(".gameSVG").append("text")
        .attr("class", "refuserNotifyText")
        .attr("x", window.innerWidth/4 + 62 + 5 - 50 + 15)
        .attr("y", -100)
        .attr("fill", "white")
        .style("font-family", "Nunito")
        .style("font-size", "24px")
        .style("font-weight", 300)
        .text("Vaccine refusers present!")
        .attr("opacity", 1)

    d3.select(".refuserNotifyText").transition().duration(500).attr("y", 200 + 32)
    d3.select(".refuserNotifyBox").transition().duration(500).attr("y", 200)
    d3.select(".refuserNotifyShadow").transition().duration(500).attr("y", 200 + 7)

    window.setTimeout(function() {
        d3.select(".refuserNotifyShadow")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".refuserNotifyBox")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".refuserNotifyText")
            .transition()
            .duration(500)
            .attr("y", -100)


    }, 2500)


}

function outbreakDetected() {
    d3.select(".gameSVG").append("rect")
        .attr("class", "outbreakNotifyShadow")
        .attr("x", window.innerWidth/4 + 62 + 5 - 50)
        .attr("y", -100)
        .attr("width", 250)
        .attr("height", 50)
        .attr("fill", "#838383")
        .attr("opacity", 1)

    d3.select(".gameSVG").append("rect")
        .attr("class", "outbreakNotifyBox")
        .attr("x", window.innerWidth/4 + 62 - 50)
        .attr("y", -100)
        .attr("width", 250)
        .attr("height", 50)
        .attr("fill", "#85bc99")
        .attr("opacity", 1)

    d3.select(".gameSVG").append("text")
        .attr("class", "outbreakNotifyText")
        .attr("x", window.innerWidth/4 + 62 + 5 - 50 + 12)
        .attr("y", -100)
        .attr("fill", "white")
        .style("font-family", "Nunito")
        .style("font-size", "24px")
        .style("font-weight", 300)
        .text("Outbreak Detected!")
        .attr("opacity", 1)

    d3.select(".outbreakNotifyText").transition().duration(500).attr("y", window.innerHeight/2 - 300 + 100 - 70 + 5)
    d3.select(".outbreakNotifyBox").transition().duration(500).attr("y", window.innerHeight/2 - 300)
    d3.select(".outbreakNotifyShadow").transition().duration(500).attr("y", window.innerHeight/2 - 300 + 7)

    window.setTimeout(function() {
        d3.select(".outbreakNotifyShadow")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".outbreakNotifyBox")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".outbreakNotifyText")
            .transition()
            .duration(500)
            .attr("y", -100)


    }, 2000)

}

function endGameSession() {
    d3.select(".gameSVG").append("rect")
        .attr("class", "endGameShadow")
        .attr("x", window.innerWidth/4 + 62 + 5 - 100)
        .attr("y", -100)
        .attr("width", 500)
        .attr("height", 125)
        .attr("fill", "#838383")


    d3.select(".gameSVG").append("rect")
        .attr("class", "endGameBox")
        .attr("x", window.innerWidth/4 + 62 - 100)
        .attr("y", -100)
        .attr("width", 500)
        .attr("height", 125)
        .attr("fill", "#85bc99")

    d3.select(".gameSVG").append("text")
        .attr("class", "endGameText")
        .attr("x", window.innerWidth/4 + 135 - 100)
        .attr("y", -100)
        .style("font-family", "Nunito")
        .style("fill", "white")
        .style("font-weight", 500)
        .style("font-size", "25px")
        .text("Outbreak has run its course.")

    d3.select(".gameSVG").append("text")
        .attr("class", "endGameSUBMIT")
        .attr("x", window.innerWidth/4 + 275 - 90)
        .attr("y", -100)
        .style("font-family", "Nunito")
        .style("fill", "white")
        .style("font-weight", 500)
        .style("font-size", "15px")
        .style("cursor", "pointer")
        .text("Submit")
        .on("mouseover", function(d) {

            d3.select(this).style("fill", "#2692F2")

        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "white")
        })
        .on("click", function() {
            d3.select(".endGameText")
                .transition()
                .duration(250)
                .attr("x", window.innerWidth/4 + 85)
                .text("Reticulating splines.")

            window.setTimeout(addPeriod1, 350)

            window.setTimeout(addPeriod2, 800)

            window.setTimeout(initScoreRecap, 1200)

        })

    d3.select(".endGameBox").transition().duration(500).attr("y", window.innerHeight/2 - 300)
    d3.select(".endGameShadow").transition().duration(500).attr("y", window.innerHeight/2 - 300 + 7)
    d3.select(".endGameText").transition().duration(500).attr("y", window.innerHeight/2 - 250)
    d3.select(".endGameSUBMIT").transition().duration(500).attr("y", window.innerHeight/2 - 250 + 50)


}

function addPeriod1() {
    d3.select(".endGameText")
        .transition()
        .duration(250)
        .attr("x", window.innerWidth/4 + 85)
        .text("Reticulating splines..")
}

function addPeriod2() {
    d3.select(".endGameText")
        .transition()
        .duration(250)
        .attr("x", window.innerWidth/4 + 85)
        .text("Reticulating splines...")
}

function setCookies() {
    var proportionSaved = Math.round((((countSavedGAME() + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0)

    if (difficultyString == "easy") {
        if (speed) {
            if ($.cookie('vaxEasyHiScoreRT') < proportionSaved) $.cookie('vaxEasyHiScoreRT', proportionSaved)
            if (proportionSaved >= easyBar) $.cookie('vaxEasyCompletion', 'true')

        }
        else {
            if ($.cookie('vaxEasyHiScore') < proportionSaved) $.cookie('vaxEasyHiScore', proportionSaved)
            if (proportionSaved >= easyBar) $.cookie('vaxEasyCompletion', 'true')
        }

    }

    if (difficultyString == "medium") {
        if (speed) {
            if ($.cookie('vaxMediumHiScoreRT') < proportionSaved) $.cookie('vaxMediumHiScoreRT', proportionSaved)
            if (proportionSaved >= mediumBar) $.cookie('vaxMediumCompletion', 'true')
        }
        else {
            if ($.cookie('vaxMediumHiScore') < proportionSaved) $.cookie('vaxMediumHiScore', proportionSaved)
            if (proportionSaved >= mediumBar) $.cookie('vaxMediumCompletion', 'true')
        }


    }

    if (difficultyString == "hard") {
        if (speed) {
            if ($.cookie('vaxHardHiScoreRT') < proportionSaved)$.cookie('vaxHardHiScoreRT', proportionSaved)
            if (proportionSaved >= hardBar) $.cookie('vaxHardCompletion', 'true')
        }
        else {
            if ($.cookie('vaxHardHiScore') < proportionSaved)$.cookie('vaxHardHiScore', proportionSaved)
            if (proportionSaved >= hardBar) $.cookie('vaxHardCompletion', 'true')
        }

    }
}

function writeCookiesJSON() {
    var proportionSaved = Math.round((((countSavedGAME() + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0)

    if (difficultyString == "easy") {

        if (speed) {
            cookie.scoresRT[0].push(proportionSaved);
            if (proportionSaved > easyBar) vaxEasyCompletion = true;
            vaxEasyHiScoreRT = Math.max.apply( Math, cookie.scoresRT[0])


        }
        else {
            cookie.scores[0].push(proportionSaved);
            if (proportionSaved > easyBar) vaxEasyCompletion = true;
            vaxEasyHiScore = Math.max.apply( Math, cookie.scores[0])


        }

    }
    if (difficultyString == "medium") {
        if (speed) {
            cookie.scoresRT[1].push(proportionSaved);
            if (proportionSaved > mediumBar) vaxMediumCompletion = true;
            vaxMediumHiScoreRT = Math.max.apply( Math, cookie.scoresRT[1])

        }
        else {
            cookie.scores[1].push(proportionSaved);
            if (proportionSaved > mediumBar) vaxMediumCompletion = true;
            vaxMediumHiScore = Math.max.apply( Math, cookie.scores[1])

        }



    }
    if (difficultyString == "hard") {
        if (speed) {
            cookie.scoresRT[2].push(proportionSaved);
            if (proportionSaved > hardBar) vaxHardCompletion = true;
            vaxHardHiScoreRT = Math.max.apply( Math, cookie.scoresRT[2])

        }
        else {
            cookie.scores[2].push(proportionSaved);
            if (proportionSaved > hardBar) vaxHardCompletion = true;
            vaxHardHiScore = Math.max.apply( Math, cookie.scores[2])

        }


    }
    $.cookie.json = false;

    if (difficultyString == undefined) {
        $.cookie('customNodes', customNodeChoice);
        $.cookie('customNeighbors', customNeighborChoice);
        $.cookie('customVaccines', customVaccineChoice);
        $.cookie('customOutbreaks', customOutbreakChoice);
        $.cookie('customRefusers', customRefuserChoice);
    }

    var easyScores = cookie.scores[0];
    var mediumScores = cookie.scores[1];
    var hardScores = cookie.scores[2];
    var score = [easyScores, mediumScores, hardScores];

    var easyScoresRT = cookie.scoresRT[0];
    var mediumScoresRT = cookie.scoresRT[1];
    var hardScoresRT = cookie.scoresRT[2];
    var scoreRT = [easyScoresRT, mediumScoresRT, hardScoresRT];

    var newCookie = {easy: vaxEasyCompletion, medium: vaxMediumCompletion, hard: vaxHardCompletion, scores: score, scoresRT: scoreRT}
    $.removeCookie('vaxCookie')
    $.cookie('vaxCookie', JSON.stringify(newCookie), { expires: 365, path: '/' })

}

function generateStackedBarChart() {
    var width = 125;
    var height = 320;

    var stackedSVG = d3.select(".gameSVG").append("svg")
        .attr("class", "stacked")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 20)
        .attr("y", 150)
        .append("svg:g")
        .attr("transform", "translate(10,320)");

    x = d3.scale.ordinal().rangeRoundBands([0, width-50])
    y = d3.scale.linear().range([0, height])
    z = d3.scale.ordinal().range(["#b7b7b7","#85BC99","#d9d678" , "#ef5555" ])
    // 1 column
    var matrix = [
        [ 1,  countSavedGAME(), numberVaccinated, numberQuarantined, (numberOfIndividuals - numberQuarantined - numberVaccinated - countSavedGAME())]

    ];

    var remapped =["uninfected","vaccinated", "quarantined", "infected"].map(function(dat,i){
        return matrix.map(function(d,ii){
            return {x: ii, y: d[i+1] };
        })
    });

    var stacked = d3.layout.stack()(remapped)

    x.domain(stacked[0].map(function(d) { return d.x; }));
    y.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y; })]);


    // Add a group for each column.
    var valgroup = stackedSVG.selectAll("g.valgroup")
        .data(stacked)
        .enter().append("svg:g")
        .attr("class", "valgroup")
        .style("fill", function(d, i) { return z(i); })
        .attr("id", function(d,i) { if (i == 0) return "uninfected"; if (i == 1) return "infected"; if (i == 2) return "quarantined"; if (i == 3) return "vaccinated"})



    // Add a rect for each date.
    var rect = valgroup.selectAll("rect")
        .data(function(d){return d;})
        .enter().append("svg:rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return -y(d.y0) - y(d.y); })
        .attr("height", function(d) { return y(d.y); })
        .attr("width", x.rangeBand())
        .attr("id", function(d) {console.log(d)})


    d3.select(".gameSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", -35)
        .attr("x2", 200)
        .attr("y1", 470)
        .attr("y2", 470)

    d3.select(".gameSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", -35)
        .attr("x2", -35)
        .attr("y1", 140)
        .attr("y2", 470)

    d3.select(".gameSVG").append("text")
        .attr("x", -83)
        .attr("y", 162)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("100%")

    d3.select(".gameSVG").append("text")
        .attr("x", -76)
        .attr("y", 310)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("50%")

    d3.select(".gameSVG").append("text")
        .attr("x", -72)
        .attr("y", 455)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("0%")



    d3.select(".gameSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 200)
        .attr("fill", "#ef5555")

    d3.select(".gameSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 230)
        .attr("fill", "#d9d678")


    d3.select(".gameSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 260)
        .attr("fill", "#85BC99")


    d3.select(".gameSVG").append("rect")
        .attr("height", 15)
        .attr("width", 15)
        .attr("x", 150)
        .attr("y", 290)
        .attr("fill", "#b7b7b7")



    d3.select(".gameSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 213)
        .text("Infected")

    d3.select(".gameSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 243)
        .text("Quarantined")


    d3.select(".gameSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 273)
        .text("Vaccinated")



    d3.select(".gameSVG").append("text")
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("fill", "#707070")
        .attr("x", 180)
        .attr("y", 303)
        .text("Uninfected")
}

function generateUninfectedBar(total, bestScore) {

    var data = [{score: total},
        {score: bestScore},
    ];

    var barWidth = 75;
    var width = (barWidth + 25) * data.length;
    var height = 320;

    var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
    var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return 100 })]).
        rangeRound([0, height]);

// add the canvas to the DOM
    var barDemo = d3.select(".gameSVG").
        append("svg").
        attr("class", "barSVG").
        attr("width", width).
        attr("height", height).
        attr("x", 420).
        attr("y", 150)

    barDemo.selectAll("rect").
        data(data).
        enter().
        append("svg:rect").
        attr("x", function(datum, index) { return x(index); }).
        attr("y", function(datum) { return height - y(datum.score); }).
        attr("height", function(datum) { return y(datum.score); }).
        attr("class", function(datum, index) { if (index == 0) return "current"; else return "best"}).
        attr("width", barWidth).
        attr("fill", function(datum, index) { if (index == 0) return "#b7b7b7"; else return "#00adea"})


    var best = d3.select(".best")
    var current = d3.select(".current")


    d3.select(".gameSVG").append("text")
        .attr("x", best.node().getBBox().x + 426)
        .attr("y", best.node().getBBox().y + 145)
        .style("font-family", "Nunito")
        .style("font-size", "30px")
        .style("color", "#707070")
        .attr("color", "#707070")
        .attr("fill", "#707070")
        .text(bestScore + "%")

    d3.select(".gameSVG").append("text")
        .attr("x", current.node().getBBox().x + 427)
        .attr("y", current.node().getBBox().y + 145)
        .style("font-family", "Nunito")
        .style("font-size", "30px")
        .style("color", "#707070")
        .attr("color", "#707070")
        .attr("fill", "#707070")
        .text(total + "%")

    d3.select(".gameSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", 395)
        .attr("x2", 625)
        .attr("y1", 470)
        .attr("y2", 470)

    d3.select(".gameSVG").append("line")
        .style("stroke", "#707070")
        .style("stroke-width", "1px")
        .attr("x1", 395)
        .attr("x2", 395)
        .attr("y1", 140)
        .attr("y2", 470)

    d3.select(".gameSVG").append("text")
        .attr("x", 347)
        .attr("y", 162)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("100%")

    d3.select(".gameSVG").append("text")
        .attr("x", 359)
        .attr("y", 310)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("50%")

    d3.select(".gameSVG").append("text")
        .attr("x", 355)
        .attr("y", 455)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("0%")

    d3.select(".gameSVG").append("text")
        .attr("x", 430)
        .attr("y", 489)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("Current")

    d3.select(".gameSVG").append("text")
        .attr("x", 540)
        .attr("y", 489)
        .style("font-family", "Nunito")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("Best")






}

function initScoreRecap() {
    writeCookiesJSON();

    // remove game features from view
    d3.select(".endGameShadow").transition().duration(500).attr("y", -200)
    d3.select(".endGameBox").transition().duration(500).attr("y", -200)
    d3.select(".endGameText").transition().duration(500).attr("y", -200)
    d3.select(".endGameSUBMIT").transition().duration(500).attr("y", -200)
    d3.select("#pinNodesDiv").remove()
    d3.select(".gameSVG").select("g").style("visibility", "hidden")
    hideGameQuarantine();

    var currentScore = Math.round((((countSavedGAME() + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0);
    var passed;
    var bar;
    var bestScore;
    var diffset;
    if (difficultyString == "easy") {
        if (speed) {
            diffset = "Easy";
            bestScore = vaxEasyHiScoreRT;
            bar = easyBar;
        }
        else {
            diffset = "Easy";
            bestScore = vaxEasyHiScore;
            bar = easyBar;
        }

    }
    if (difficultyString == "medium") {
        if (speed) {
            diffset = "Medium";
            bestScore = vaxMediumHiScoreRT;
            bar = mediumBar;

        }
        else {
            diffset = "Medium";
            bestScore = vaxMediumHiScore;
            bar = mediumBar;

        }

    }
    if (difficultyString == "hard") {
        if (speed) {
            diffset = "Hard";
            bestScore = vaxHardHiScoreRT;
            bar = hardBar;

        }
        else {
            diffset = "Hard";
            bestScore = vaxHardHiScore;
            bar = hardBar;

        }

    }
    if (difficultyString == null) {
        bestScore = currentScore;
        bar = 0;
    }

    if (currentScore >= bar) passed = true
    else passed = false;



    d3.select(".gameSVG").append("text")
        .attr("class", "networkSizeText")
        .attr("x", -85)
        .attr("y", 90)
        .style("font-size", "40px")
        .text("Network Size: " + numberOfIndividuals);

    generateStackedBarChart();

    generateUninfectedBar(currentScore, bestScore);

    addTextRecap(bar, passed);

    addShareButtons(bestScore, diffset);





}

function addShareButtons(bestScore,diffset) {
    if (difficultyString == undefined) diffset = "Custom"


    var twitterText = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2F.vax.herokuapp.com&text=I just stopped an epidemic in its tracks! Can you can beat " + bestScore + "%25 on " + diffset + "? Fight the outbreak at&url=http%3A%2F%2Fvax.herokuapp.com";
    var facebookText = "http://www.facebook.com/sharer.php?s=100&p[title]=Vax! | Gamifying Epidemic Prevention&p[summary]=I just stopped an epidemic in its tracks! Can you beat " + bestScore + "% on " + diffset + "?&p[url]=http://vax.herokuapp.com";


    d3.select(".gameSVG").append("image")
        .attr("x", 790)
        .attr("y", 365)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/facebook_icon.png")
        .attr("class", "shareIcon")
        .attr("id", "facebook")
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .style("cursor", "pointer")
        .attr("opacity", 0)
        .on("click", function() {
            window.location.href = facebookText;
        })

    d3.select(".gameSVG").append("image")
        .attr("x", 865)
        .attr("y", 365)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/twitter_icon.png")
        .attr("class", "shareIcon")
        .attr("id", "twitter")
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = twitterText;
        })

    d3.select(".gameSVG").append("image")
        .attr("x", 940)
        .attr("y", 365)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/googleplus_icon.png")
        .attr("class", "shareIcon")
        .attr("id", "g+")
        .attr("opacity", 0)
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = "https://plus.google.com/share?url=http://vax.herokuapp.com";
        })

    d3.select(".gameSVG").append("text")
        .attr("x", 750)
        .attr("y", 345)
        .style("font-family", "Nunito")
        .style("font-size", "25px")
        .style("font-weight", "500")
        .style("fill", "#707070")
        .text("Share ▾")
        .on("click", function() {
            d3.selectAll(".shareIcon")
                .transition()
                .duration(500)
                .attr("opacity", 1)
        })



}

function addTextRecap(bar, passed) {
    if (passed) {

        if (difficultyString == null) {
            d3.select(".gameSVG").append("text")
                .style("font-family", "Nunito")
                .style("font-size", "55px")
                .style("font-weight", "500")
                .style("fill", "#707070")
                .attr("class", "recapBinaryText")
                .attr("x", 732)
                .attr("y", 180)
                .text("Play Again!")

            d3.select(".gameSVG").append("text")
                .attr("class", "recapButton")
                .attr("x", 450)
                .attr("y", 625)
                .text("Retry")
                .style("font-size", "45px")
                .on("click", retry)
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#2692F2")
                })
                .on("mouseout", function() {
                    d3.select(this).style("fill", "#707070")
                })
            return;
        }

        d3.select(".gameSVG").append("text")
            .style("font-family", "Nunito")
            .style("font-size", "75px")
            .style("font-weight", "500")
            .style("fill", "#707070")
            .attr("class", "recapBinaryText")
            .attr("x", 749)
            .attr("y", 180)
            .text("Passed!")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapText1")
            .attr("x", 755)
            .attr("y", 230)
            .style("font-family", "Nunito")
            .style("font-size", "20px")
            .style("font-weight", "300")
            .style("fill", "#707070")
            .text("Well done! You exceeded the")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapText2")
            .attr("x", 755)
            .attr("y", 255)
            .style("font-family", "Nunito")
            .style("font-size", "20px")
            .style("font-weight", "300")
            .style("fill", "#707070")
            .text(bar + "% survival rate required to")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapText3")
            .attr("x", 755)
            .attr("y", 280)
            .style("font-family", "Nunito")
            .style("font-size", "20px")
            .style("font-weight", "300")
            .style("fill", "#707070")
            .text("move on to the next level.")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapButton")
            .attr("x", 645)
            .attr("y", 590)
            .style("font-size", "45px")
            .text("Next")
            .on("click", next)
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })

        d3.select(".gameSVG").append("text")
            .attr("class", "recapButton")
            .style("font-size", "45px")
            .attr("x", 240)
            .attr("y", 590)
            .text("Retry")
            .on("click", retry)
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })

    }
    else {
        d3.select(".gameSVG").append("text")
            .style("font-family", "Nunito")
            .style("font-size", "55px")
            .style("font-weight", "500")
            .style("fill", "#707070")
            .attr("class", "recapBinaryText")
            .attr("x", 735)
            .attr("y", 180)
            .text("Try Again!")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapText1")
            .attr("x", 755)
            .attr("y", 225)
            .style("font-family", "Nunito")
            .style("font-size", "20px")
            .style("font-weight", "300")
            .style("fill", "#707070")
            .text("You did not exceed the")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapText2")
            .attr("x", 730)
            .attr("y", 250)
            .style("font-family", "Nunito")
            .style("font-size", "20px")
            .style("font-weight", "300")
            .style("fill", "#707070")
            .text(bar + "% survival rate required to")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapText3")
            .attr("x", 742)
            .attr("y", 273)
            .style("font-family", "Nunito")
            .style("font-size", "20px")
            .style("font-weight", "300")
            .style("fill", "#707070")
            .text("move on to the next level.")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapButton")
            .attr("x", 450)
            .attr("y", 625)
            .style("font-size", "45px")
            .text("Retry")
            .on("click", retry)
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })


    }

}

function loadConclusionText() {
    var total = Math.round((((numberSaved + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0);


    d3.select(".popup_game_share").style("visibility", "visible")

    d3.select("#pinNodesDiv").remove()

    var bar;
    var bestScore;
    if (difficultyString == "easy") {
        bestScore = vaxEasyHiScore;
        bar = easyBar;
    }
    if (difficultyString == "medium") {
        bestScore = vaxMediumHiScore;
        bar = mediumBar;
    }
    if (difficultyString == "hard") {
        bestScore = vaxHardHiScore;
        bar = hardBar;
    }
    if (difficultyString == null) bestScore = total;

    d3.select(".gameSVG").append("text")
        .attr("class", "bestScore")
        .attr("x", backX + 25)
        .attr("y", 420)
        .style("font-family", "Nunito")
        .style("fill", "#707070")
        .style("font-size", "24px")
        .style("font-weight", "500")
        .text("Best Score: " + bestScore + "%");

    var diffset;

    if (difficultyString == "easy") diffset = "Easy";
    if (difficultyString == "medium") diffset = "Medium";
    if (difficultyString == "hard") diffset = "Hard";
    if (difficultyString == null) {
        diffset = "Custom";
        bestScore = total;
    }

    var twitterText = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2F.vax.herokuapp.com&text=I just stopped an epidemic in its tracks! Can you can beat " + bestScore + "%25 on " + diffset + "? Fight the outbreak at&url=http%3A%2F%2Fvax.herokuapp.com";
    var facebookText = "http://www.facebook.com/sharer.php?s=100&p[title]=Vax! | Gamifying Epidemic Prevention&p[summary]=I just stopped an epidemic in its tracks! Can you beat " + bestScore + "% on " + diffset + "?&p[url]=http://vax.herokuapp.com";


    d3.select(".gameSVG").append("image")
        .attr("x", 150)
        .attr("y", 355)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/facebook_icon.png")
        .attr("id", "facebook")
        .style("padding", "12px 7px 0px 7px")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = facebookText;
        })

    d3.select(".gameSVG").append("image")
        .attr("x", 215)
        .attr("y", 355)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/twitter_icon.png")
        .attr("id", "twitter")
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = twitterText;
        })

    d3.select(".gameSVG").append("image")
        .attr("x", 280)
        .attr("y", 355)
        .attr("height", "50px")
        .attr("width", "50px")
        .attr("xlink:href", "/assets/googleplus_icon.png")
        .attr("id", "twitter")
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = "https://plus.google.com/share?url=http://vax.herokuapp.com";
        })


    if (difficultyString == null) {
        d3.select(".gameSVG").append("text")
            .attr("class", "recapText")
            .attr("x", 260)
            .attr("y", 525)
            .text("Well done, you saved " + total + "% of the network.")

        d3.select(".gameSVG").append("text")
            .attr("class", "recapButton")
            .attr("x", 470)
            .attr("y", 590)
            .text("Retry")
            .on("click", retry)
            .on("mouseover", function() {
                d3.select(this).style("fill", "#2692F2")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "#707070")
            })

    }
    else {
        if (total > bar) {
            d3.select(".gameSVG").append("text")
                .attr("class", "recapText")
                .attr("x", 260)
                .attr("y", 525)
                .text("Well done, you saved " + total + "% of the network.")

            d3.select(".gameSVG").append("text")
                .attr("class", "recapButton")
                .attr("x", 355)
                .attr("y", 590)
                .text("Retry")
                .on("click", retry)
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#2692F2")
                })
                .on("mouseout", function() {
                    d3.select(this).style("fill", "#707070")
                })


            d3.select(".gameSVG").append("text")
                .attr("class", "recapButton")
                .attr("x", 580)
                .attr("y", 590)
                .text("Next")
                .on("click", next)
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#2692F2")
                })
                .on("mouseout", function() {
                    d3.select(this).style("fill", "#707070")
                })

        }
        else {
            d3.select(".gameSVG").append("text")
                .attr("class", "recapText")
                .attr("x", 200)
                .attr("y", 525)
                .text("Save " + bar + "% of the network to unlock the next stage.")

            d3.select(".gameSVG").append("text")
                .attr("class", "recapButton")
                .attr("x", 470)
                .attr("y", 590)
                .text("Retry")
                .on("click", retry)
                .on("mouseover", function() {
                    d3.select(this).style("fill", "#2692F2")
                })
                .on("mouseout", function() {
                    d3.select(this).style("fill", "#707070")
                })
        }
    }
}

function retry() {
    d3.select(".gameSVG").remove()
    graph = {};
    timestep = 0;
    diseaseIsSpreading = false;
    timeToStop = false;

    if (difficultyString == null) initCustomGame();
    else initBasicGame(difficultyString);

}

function next() {
    d3.select(".gameSVG").remove()
    graph = {};
    timestep = 0;
    diseaseIsSpreading = false;
    timeToStop = false;
    hideGameQuarantine();

    if (difficultyString == "hard" || difficultyString == null) {
        window.location.href = "/game"

    }
    else {
        if (difficultyString == "easy") {
            difficultyString = "medium";
            initBasicGame("medium")
            return;
        }
        if (difficultyString == "medium") {
            difficultyString = "hard";
            initBasicGame("hard");
            return;
        }
    }

}

jQuery(document).bind('keydown', function (evt){
    if (currentNode == undefined) return;

    if (evt.shiftKey && evt.which == 32) {
        currentNode.fixed = false;
        currentElement.style("stroke-width", "2px")
    }
    else {
        if (evt.which == 32) {
            currentNode.fixed = true;
            currentElement.style("stroke-width", "3px")
        }
    }
});

function toggleDegreeFxn() {
    toggleDegree = !toggleDegree;

    if (toggleDegree && difficultyString == "easy") charge = -900;
    if (toggleDegree && difficultyString == "medium") charge = -700;
    if (toggleDegree && difficultyString == "hard") charge = -600;

    if (!toggleDegree) charge = -300;

    gameUpdate();

}

function getCartesianDistance(originalLocation, newLocation) {
    var x1 = originalLocation[0];
    var y1 = originalLocation[1];
    var x2 = newLocation[0];
    var y2 = newLocation[1];
    var squaredDeltaX = Math.pow(x1 - x2, 2)
    var squaredDeltaY = Math.pow(y1 - y2, 2)
    return Math.pow(squaredDeltaX + squaredDeltaY, 0.5)
}

