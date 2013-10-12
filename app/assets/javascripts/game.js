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

var gameSVG ;
var width = 975;
var height = 800 - 45 - 50;  // standard height - footer:height - footer:bottomMargin
var charge = -300;
var friction = 0.9;

var numberOfVaccines = 0;
var vaccineSupply = 0;

var difficultyString;
var customNodeChoice;
var customNeighborChoice;
var customVaccineChoice;
var customOutbreakChoice;

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
var hardBar = 35;

var vaxEasyCompletion;
var vaxMediumCompletion;
var vaxHardCompletion;

var vaxEasyHiScore;
var vaxMediumHiScore;
var vaxHardHiScore;

var currentNode;
var currentElement;

var toggleDegree = false;


initFooter();
initBasicMenu();
window.setTimeout(initCookiesOnDelay, 500)

function initCookiesOnDelay() {
    readCookies();
}

function readCookies() {

    var cookies = $.cookie()

    if($.cookie('vaxEasyCompletion') == undefined) initCookies();

    cookies = $.cookie();

    vaxEasyCompletion = cookies.vaxEasyCompletion;
    vaxMediumCompletion = cookies.vaxMediumCompletion;
    vaxHardCompletion = cookies.vaxHardCompletion;

    vaxEasyHiScore = cookies.vaxEasyHiScore;
    vaxMediumHiScore = cookies.vaxMediumHiScore;
    vaxHardHiScore = cookies.vaxHardHiScore;

    customNodeChoice = parseInt(cookies.customNodes);
    customNeighborChoice = parseInt(cookies.customNeighbors);
    customVaccineChoice = parseInt(cookies.customVaccines);
    customOutbreakChoice = parseInt(cookies.customOutbreaks);

    cookieBasedModeSelection();
}

function initCookies() {
    $.cookie('vaxEasyCompletion', false, { expires: 365, path: '/' });
    $.cookie('vaxMediumCompletion', false, { expires: 365, path: '/' });
    $.cookie('vaxHardCompletion', false, { expires: 365, path: '/' });

    $.cookie('vaxEasyHiScore', 0, { expires: 365, path: '/' });
    $.cookie('vaxMediumHiScore', 0, { expires: 365, path: '/' });
    $.cookie('vaxHardHiScore', 0, { expires: 365, path: '/' });

    $.cookie('customNodes', 75, { expires: 365, path: '/'})
    $.cookie('customNeighbors', 4, { expires: 365, path: '/'})
    $.cookie('customVaccines', 15, { expires: 365, path: '/'})
    $.cookie('customOutbreaks', 2, { expires: 365, path: '/'})
}

function clearCookies() {
    $.removeCookie('vaxEasyCompletion');
    $.removeCookie('vaxMediumCompletion');
    $.removeCookie('vaxHardCompletion');

    $.removeCookie('vaxEasyHiScore');
    $.removeCookie('vaxMediumHiScore');
    $.removeCookie('vaxHardHiScore');

}

function allAccess() {
    $.cookie('vaxEasyCompletion', true, { expires: 365, path: '/' });
    $.cookie('vaxMediumCompletion', true, { expires: 365, path: '/' });
    $.cookie('vaxHardCompletion', true, { expires: 365, path: '/' });

    $.cookie('vaxEasyHiScore', 100, { expires: 365, path: '/' });
    $.cookie('vaxMediumHiScore', 100, { expires: 365, path: '/' });
    $.cookie('vaxHardHiScore', 100, { expires: 365, path: '/' });
}


function cookieBasedModeSelection() {
    d3.select("#difficultyEasy")
        .on("mouseover", function() {
            d3.select(this).style("color", "#2692F2")
        })
        .on("mouseout", function() {
            d3.select(this).style("color", "#707070")
        })

    // set medium based on easy
    if (vaxEasyCompletion == "true") {
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
    if (vaxMediumCompletion == "true") {
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
    if (vaxHardCompletion == "true") {
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
        numberOfVaccines = 10;
        transmissionRate = transmissionRates[4];
        recoveryRate = recoveryRates[0];
        independentOutbreaks = 3;
    }

    graph = generateSmallWorld(numberOfIndividuals, rewire, meanDegree);

    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].fixed = false;
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

    graph = generateSmallWorld(numberOfIndividuals, rewire, meanDegree);
    removeDuplicateEdges(graph);

    d3.select("#customMenuDiv").style("right", "-1000px").style("visibility", "hidden")

    window.setTimeout(function() {
        d3.select("#customMenuDiv").remove()
        initGameSpace();
    }, 500);

}

function initGameSpace() {
    game = true;

    loadGameSyringe();

    vaccinateMode     = false ;
    quarantineMode    = false ;
    numberVaccinated  = 0     ;
    numberQuarantined = 0     ;

    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+

    if (isFirefox) {
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


}

function nodeSize(node) {
    var size = 8;
    if (toggleDegree) {
        size = findNeighbors(node).length * 2;
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
    return color;
}

function gameClick(node) {
    if (vaccinateMode) {
        node.status = "V";
        numberOfVaccines--;
        numberVaccinated++;
    }
    else {
        if (quarantineMode && node.status == "S") {
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
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min((height *.85) - 8, d.y)); });
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

//                console.log(numberOfSusceptiblesPerGroup + "\t" + numberOfInfectedPerGroup)

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
            if (toggleDegree) currentSize = findNeighbors(d).length * 2;
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

    d3.select(".actionVax").append("text")
        .attr("class", "vaccineCounterText")
        .style("font-size", "16px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text("")
        .style("right", "45px")

    d3.select(".vaccineCounterText").text(numberOfVaccines)
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

    d3.select(".actionQuarantine").append("text")
        .attr("class", "quarantineCounterText")
        .style("font-size", "16px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text("")

    d3.select(".quarantineCounterText").text("x" + numberQuarantined)
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

}

function endGameSession() {
    d3.select(".gameSVG").append("rect")
        .attr("class", "endGameShadow")
        .attr("x", window.innerWidth/4 + 62 + 5 - 100)
        .attr("y", window.innerHeight/2 - 300 + 7)
        .attr("width", 500)
        .attr("height", 125)
        .attr("fill", "#838383")

    d3.select(".gameSVG").append("rect")
        .attr("class", "endGameBox")
        .attr("x", window.innerWidth/4 + 62 - 100)
        .attr("y", window.innerHeight/2 - 300)
        .attr("width", 500)
        .attr("height", 125)
        .attr("fill", "#85bc99")

    d3.select(".gameSVG").append("text")
        .attr("class", "endGameText")
        .attr("x", window.innerWidth/4 + 135 - 100)
        .attr("y", window.innerHeight/2 - 250)
        .style("font-family", "Nunito")
        .style("fill", "white")
        .style("font-weight", 500)
        .style("font-size", "25px")
        .text("Outbreak has run its course.")

    d3.select(".gameSVG").append("text")
        .attr("class", "endGameSUBMIT")
        .attr("x", window.innerWidth/4 + 275 - 90)
        .attr("y", window.innerHeight/2 - 250 + 50)
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
        if (proportionSaved > easyBar) $.cookie('vaxEasyCompletion', 'true')
    }

    if (difficultyString == "medium") {
        if ($.cookie('vaxMediumHiScore') < proportionSaved) $.cookie('vaxMediumHiScore', proportionSaved)
        if (proportionSaved > mediumBar) $.cookie('vaxMediumCompletion', 'true')
    }

    if (difficultyString == "hard") {
        if ($.cookie('vaxHardHiScore') < proportionSaved)$.cookie('vaxHardHiScore', proportionSaved)
        if (proportionSaved > hardBar) $.cookie('vaxHardCompletion', 'true')
    }
}

function initScoreRecap() {
    setCookies();

    d3.select(".endGameShadow").remove()
    d3.select(".endGameBox").remove()
    d3.select(".endGameText").remove()
    d3.select(".endGameSUBMIT").remove();

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

    d3.select(".gameSVG").append("rect")
        .attr("class", "whiteBackground")
        .attr("x", -500)
        .attr("y", 475)
        .attr("width", 5000)
        .attr("height", 150)
        .attr("fill", "white")

    loadConclusionText();


}

function loadConclusionText() {
    var bar;
    if (difficultyString == "easy") bar = easyBar;
    if (difficultyString == "medium") bar = mediumBar;
    if (difficultyString == "hard") bar = hardBar;

    var total = Math.round((((numberSaved + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0);

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


            d3.select(".gameSVG").append("text")
                .attr("class", "recapButton")
                .attr("x", 580)
                .attr("y", 590)
                .text("Next")
                .on("click", next)

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

    if (difficultyString == "hard") initCustomGame();
    else {
        if (difficultyString == "easy") {
            initBasicGame("medium")
            difficultyString = "medium"
            return;
        }
        if (difficultyString == "medium") {
            initBasicGame("hard");
            difficultyString = "hard";
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

    if (toggleDegree && difficultyString == "medium") charge = -500;
    if (toggleDegree && difficultyString == "hard") charge = -400;

    if (!toggleDegree) charge = -300;

    gameUpdate();

}


