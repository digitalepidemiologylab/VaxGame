var numberOfIndividuals, meanDegree, rewire = 0.1;
var graph = {};
var force,node, link;

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
var width = 975;
var height = 800 - 45 - 50;  // standard height - footer:height - footer:bottomMargin
var charge = -500;
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
var newInfections;
var xyCoords;
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

var easyScores;
var mediumScores;
var hardScores;
var scores = {easy: easyScores, medium: mediumScores, hard: hardScores};

var currentNode;
var currentElement;

var toggleDegree = true;

var cookie = {};
var pop;

initBasicMenu();
window.setTimeout(initCookiesOnDelay, 500)

function initCookiesOnDelay() {
    readCookiesJSON();
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



    cookieBasedModeSelection();
}

//function readCookies() {
//    var cookies = $.cookie()
//
//    if($.cookie('vaxEasyCompletion') == undefined) initCookies();
//
//    cookies = $.cookie();
//
//    vaxEasyCompletion = cookies.vaxEasyCompletion;
//    vaxMediumCompletion = cookies.vaxMediumCompletion;
//    vaxHardCompletion = cookies.vaxHardCompletion;
//
//    vaxEasyHiScore = cookies.vaxEasyHiScore;
//    vaxMediumHiScore = cookies.vaxMediumHiScore;
//    vaxHardHiScore = cookies.vaxHardHiScore;
//
//    customNodeChoice = parseInt(cookies.customNodes);
//    customNeighborChoice = parseInt(cookies.customNeighbors);
//    customVaccineChoice = parseInt(cookies.customVaccines);
//    customOutbreakChoice = parseInt(cookies.customOutbreaks);
//
//
//    cookieBasedModeSelection();
//}

//function initCookies() {
//    $.cookie('vaxEasyCompletion', false, { expires: 365, path: '/' });
//    $.cookie('vaxMediumCompletion', false, { expires: 365, path: '/' });
//    $.cookie('vaxHardCompletion', false, { expires: 365, path: '/' });
//
//    $.cookie('vaxEasyHiScore', 0, { expires: 365, path: '/' });
//    $.cookie('vaxMediumHiScore', 0, { expires: 365, path: '/' });
//    $.cookie('vaxHardHiScore', 0, { expires: 365, path: '/' });
//
//    $.cookie('customNodes', 75, { expires: 365, path: '/'})
//    $.cookie('customNeighbors', 4, { expires: 365, path: '/'})
//    $.cookie('customVaccines', 15, { expires: 365, path: '/'})
//    $.cookie('customOutbreaks', 2, { expires: 365, path: '/'})
//}

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

    var cookie = {easy: false, medium: false, hard: false, scores: score}

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
    easyScores = ["100"];
    mediumScores = ["100"];
    hardScores = ["100"];
    var score = [easyScores, mediumScores, hardScores];

    var cookie = {easy: true, medium: true, hard: true, scores: score}
    $.removeCookie('vaxCookie')
    $.cookie('vaxCookie', JSON.stringify(cookie), { expires: 365, path: '/' })

}


function cookieBasedModeSelection() {

    if (vaxEasyHiScore == -Infinity) {}
    else d3.select(".easyHi")
        .text("(Best: " + vaxEasyHiScore + "%)")

    if (vaxMediumHiScore == -Infinity) {}
    else d3.select(".mediumHi")
        .text("(Best: " + vaxMediumHiScore + "%)")

    if (vaxHardHiScore == -Infinity) {}
    else d3.select(".hardHi")
        .text("(Best: " + vaxHardHiScore + "%)")



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
    if (independentOutbreaks > (graph.nodes.length - numberOfVaccines)) independentOutbreaks = 1;

    if (customNodeChoice > 100) charge = -150;
    if (customNodeChoice > 125) charge = -130;

    graph = generateSmallWorld(numberOfIndividuals, rewire, meanDegree);
    removeDuplicateEdges(graph);

    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].refuser = false;
    }

    for (var i = 0; i < numberOfRefusers; i++) {
        do {
            var node = graph.nodes[Math.round(Math.random() * graph.nodes.length)]
        }
        while (node.refuser)
        node.refuser = true;
    }

    d3.select("#customMenuDiv").style("right", "-1000px").style("visibility", "hidden")

    window.setTimeout(function() {
        d3.select("#customMenuDiv").remove()
        initGameSpace();
    }, 500);

}

function initGameSpace() {
    pop = document.getElementById('audio');
    game = true;

    loadGameSyringe();
    initFooter();
    d3.select(".gameMenuBox").style("right", "-300px")
    window.setTimeout(function() {d3.select(".gameMenuBox").style("right", "-10px"); d3.select(".gameVaxLogoDiv").style("left", "-12px")},1)



    vaccinateMode     = false ;
    quarantineMode    = false ;
    numberVaccinated  = 0     ;
    numberQuarantined = 0     ;

    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6


    if (isFirefox || isIE) {
        gameSVG = d3.select("body").append("svg")
            .attr({
                "width": 950,
                "height": 768 - 45
            })
            .attr("class", "gameSVG")
            .attr("pointer-events", "all")
            .append('svg:g');



    }
    else {
        gameSVG = d3.select("body").append("svg")
            .attr({
                "width": "100%",
                "height": "87.5%"  //footer takes ~12.5% of the page
            })
            .attr("viewBox", "0 0 " + width + " " + height )
            .attr("class", "gameSVG")
            .attr("pointer-events", "all")
            .append('svg:g');
    }

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
    node = gameSVG.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", nodeSize)
        .attr("fill", nodeColor)
        .call(force.drag)
        .on("click", gameClick)
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

    loadHotKeyText();
    if (difficultyString == "hard" || difficultyString == null) refusersPresent();





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
    var size = 8;
    if (toggleDegree) {
        size = (findNeighbors(node).length + 1.5) * 1.9;
        if (meanDegree > 3) size = (findNeighbors(node).length+1) * 1.65;
        if (meanDegree > 4) size = (findNeighbors(node).length+1) * 1.25;

    }
    return size;
}

function nodeColor(node) {
    var color = null;
    if (node.status == "S") color = "#b7b7b7";
    if (node.status == "E") color = "#ef5555";
    if (node.status == "I") color = "#ef5555";
    if (node.status == "R") color = "#9400D3";
    if (node.status == "V") color = "#d9d678";
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


// tick function, which does the physics for each individual node & link.
function tick() {
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
        .data(nodes, function(d) { return d.id; })
        .style("fill", nodeColor)

    d3.selectAll("circle.node")
        .transition()
        .duration(100)
        .attr("r", nodeSize)

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill", nodeColor)
        .on("click", gameClick)
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
            if (toggleDegree) {
                currentSize = (findNeighbors(d).length + 1.5) * 1.9;
                if (meanDegree > 3) currentSize = (findNeighbors(d).length+1) * 1.65;
                if (meanDegree > 4) currentSize = (findNeighbors(d).length+1) * 1.25;

            }
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
        if ($.cookie('vaxEasyHiScore') < proportionSaved) $.cookie('vaxEasyHiScore', proportionSaved)
        if (proportionSaved >= easyBar) $.cookie('vaxEasyCompletion', 'true')
    }

    if (difficultyString == "medium") {
        if ($.cookie('vaxMediumHiScore') < proportionSaved) $.cookie('vaxMediumHiScore', proportionSaved)
        if (proportionSaved >= mediumBar) $.cookie('vaxMediumCompletion', 'true')
    }

    if (difficultyString == "hard") {
        if ($.cookie('vaxHardHiScore') < proportionSaved)$.cookie('vaxHardHiScore', proportionSaved)
        if (proportionSaved >= hardBar) $.cookie('vaxHardCompletion', 'true')
    }
}

function writeCookiesJSON() {
    var proportionSaved = Math.round((((countSavedGAME() + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0)

    if (difficultyString == "easy") {
        cookie.scores[0].push(proportionSaved);
        if (proportionSaved > easyBar) vaxEasyCompletion = true;
        vaxEasyHiScore = Math.max.apply( Math, cookie.scores[0])

    }
    if (difficultyString == "medium") {
        cookie.scores[1].push(proportionSaved);
        if (proportionSaved > mediumBar) vaxMediumCompletion = true;
        vaxMediumHiScore = Math.max.apply( Math, cookie.scores[1])

    }
    if (difficultyString == "hard") {
        cookie.scores[2].push(proportionSaved);
        if (proportionSaved > hardBar) vaxHardCompletion = true;
        vaxHardHiScore = Math.max.apply( Math, cookie.scores[2])
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

    var newCookie = {easy: vaxEasyCompletion, medium: vaxMediumCompletion, hard: vaxHardCompletion, scores: score}
    $.removeCookie('vaxCookie')
    $.cookie('vaxCookie', JSON.stringify(newCookie), { expires: 365, path: '/' })

}

function initScoreRecap() {
//    setCookies();
    writeCookiesJSON();

    d3.select(".endGameShadow").transition().duration(500).attr("y", -200)
    d3.select(".endGameBox").transition().duration(500).attr("y", -200)
    d3.select(".endGameText").transition().duration(500).attr("y", -200)
    d3.select(".endGameSUBMIT").transition().duration(500).attr("y", -200)

    d3.select(".gameSVG").select("g").style("visibility", "hidden")
    hideGameQuarantine();

    // details - left
    d3.select(".gameSVG").append("text")
        .attr("class", "networkSizeText")
        .attr("x", backX + 25)
        .attr("y", 195 - 75)
        .text("Network Size: " + numberOfIndividuals);

    d3.select(".gameSVG").append("text")
        .attr("class", "numberQuarantinedText")
        .attr("x", backX + 25)
        .attr("y", 230 - 75)
        .text("Quarantined: " + numberQuarantined)

    d3.select(".gameSVG").append("text")
        .attr("class", "numberVaccinatedText")
        .attr("x", backX + 25)
        .attr("y", 265 - 75)
        .attr("opacity", 1)
        .text("Vaccinated: " + numberVaccinated)

    d3.select(".gameSVG").append("text")
        .attr("class", "numberUntreatedText")
        .attr("x", backX + 25)
        .attr("y", 300 - 75)
        .attr("opacity", 1)
        .text("Untreated: " + countSavedGAME())

    numberSaved = countSavedGAME();

    infectedHeight = (1.00 - ((numberVaccinated+numberQuarantined+numberSaved)/numberOfIndividuals).toFixed(2)) * (300);
    uninfectedHeight = ((numberVaccinated+numberQuarantined+numberSaved)/numberOfIndividuals).toFixed(2) * (300)

    uninfectedBar = d3.select(".gameSVG").append("rect")
        .attr("class", "uninfectedBar")
        .attr("x", 1200 + 25)
        .attr("y", 175 - 75)
        .attr("height", uninfectedHeight)
        .attr("width", 100)
        .attr("opacity", 0)
        .attr("fill", "#b7b7b7")

    centerElement(uninfectedBar, "uninfectedBar")
    uninfectedBar.attr("opacity", 1)

    d3.select(".uninfectedBar").attr("x", uninfectedBar.node().getBBox().x + 25)


    var bottomOfUninfected = uninfectedBar.node().getBBox().y + uninfectedHeight + 20;

    infectedBar = d3.select(".gameSVG").append("rect")
        .attr("class", "infectedBar")
        .attr("x", 1200)
        .attr("y", bottomOfUninfected)
        .attr("height", infectedHeight)
        .attr("width", 100)
        .attr("opacity", 0)
        .attr("fill", "#ef5555")

    centerElement(infectedBar, "infectedBar")
    infectedBar.attr("opacity", 1)

    d3.select(".infectedBar").attr("x", infectedBar.node().getBBox().x + 25)

    // legend - right
    d3.select(".gameSVG").append("text")
        .attr("class", "uninfectedLegendText")
        .attr("x", backX + 550 + 25)
        .attr("y", 195 - 75)
        .text("Saved")

    d3.select(".gameSVG").append("text")
        .attr("class", "infectedLegendText")
        .attr("x", backX + 550 + 25)
        .attr("y", 245 - 75)
        .text("Infected")

    d3.select(".gameSVG").append("text")
        .attr("class", "uninfectedPercentage")
        .attr("x", backX + 625 + 25)
        .attr("y", 195 - 75)
        .text(Math.round((((numberSaved + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0) + "%")

    d3.select(".gameSVG").append("rect")
        .attr("class", "uninfectedLegendBox")
        .attr("x", backX + 521 + 25)
        .attr("y", 177 - 75)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#b7b7b7")

    d3.select(".gameSVG").append("rect")
        .attr("class", "infectedLegendBox")
        .attr("x", backX + 521 + 25)
        .attr("y", 227 - 75)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#ef5555")

//    d3.select(".gameSVG").append("rect")
//        .attr("class", "whiteBackground")
//        .attr("x", -130)
//        .attr("y", 475)
//        .attr("width", window.innerWidth + 100)
//        .attr("height", 150)
//        .attr("fill", "white")

    loadConclusionText();


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
        .attr("height", "35px")
        .attr("width", "35px")
        .attr("xlink:href", "/assets/facebook_icon.png")
        .attr("id", "facebook")
        .style("padding", "12px 7px 0px 7px")
        .style("width", "25px")
        .style("cursor", "pointer")
        .on("click", function() {
            window.location.href = facebookText;
        })

    d3.select(".gameSVG").append("image")
        .attr("x", 215)
        .attr("y", 355)
        .attr("height", "35px")
        .attr("width", "35px")
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
        .attr("height", "35px")
        .attr("width", "35px")
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
    d3.select(".popup_game_share").style("visibility", "hidden")
    d3.select(".gameSVG").remove()
    graph = {};
    timestep = 0;
    diseaseIsSpreading = false;
    timeToStop = false;

    if (difficultyString == null) initCustomGame();
    else initBasicGame(difficultyString);

}

function next() {
    d3.select(".popup_game_share").style("visibility", "hidden")
    d3.select(".gameSVG").remove()
    graph = {};
    timestep = 0;
    diseaseIsSpreading = false;
    timeToStop = false;
    hideGameQuarantine();

    if (difficultyString == "hard" || difficultyString == null) {
        window.location.href = "http://vax.herokuapp.com/game"

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

    if (toggleDegree && difficultyString == "medium") charge = -600;
    if (toggleDegree && difficultyString == "hard") charge = -400;

    if (!toggleDegree) charge = -300;

    gameUpdate();

}


