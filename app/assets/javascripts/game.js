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
var width = 1024;
var height = 768 - 45 - 50; // standard height - footer:height - footer:bottomMargin
var charge = -400;
var friction = 0.80;

var numberOfVaccines = 0;
var vaccineSupply = 0;

var difficultyString;
var customNodeChoice = 75;
var customNeighborChoice = 4;
var customVaccineChoice = 15;
var customOutbreakChoice = 2;

var timestep = 0;
var newInfections;
var xyCoords;
var diseaseIsSpreading = false;
var timeToStop = false;

var infectedBar;
var uninfectedBar;
var infectedHeight;
var uninfectedHeight;

initFooter();
initBasicMenu();

function initBasicGame(difficulty) {
    d3.select(".difficultySelection").remove();
    d3.select(".difficultySelection").remove();
    d3.select(".newGameHeader").remove();
    d3.select("#customMenuDiv").remove();

    graph             = {}    ;
    graph.nodes       = []    ;
    graph.links       = []    ;

    if (difficulty == "easy") {
        numberOfIndividuals = 30;
        meanDegree = 3;
        numberOfVaccines = 5;
        transmissionRate = transmissionRates[4];
        recoveryRate = recoveryRates[0];
    }

    if (difficulty == "medium") {
        numberOfIndividuals = 50;
        meanDegree = 4;
        numberOfVaccines = 10;
        transmissionRate = transmissionRates[6];
        recoveryRate = recoveryRates[0];
    }

    if (difficulty == "hard") {
        numberOfIndividuals = 100;
        meanDegree = 5;
        numberOfVaccines = 25;
        transmissionRate = transmissionRates[6];
        recoveryRate = recoveryRates[0];
        independentOutbreaks = 2;
    }

    graph = generateSmallWorld(numberOfIndividuals, rewire, meanDegree);
    removeDuplicateEdges(graph);
    initGameSpace();
}

function initCustomGame() {
    d3.select(".newGameHeader").remove();
    graph             = {}    ;
    graph.nodes       = []    ;
    graph.links       = []    ;

    numberOfIndividuals = customNodeChoice;
    meanDegree = customNeighborChoice;
    numberOfVaccines = customVaccineChoice;
    vaccineSupply = numberOfVaccines;
    independentOutbreaks = customOutbreakChoice;

    graph = generateSmallWorld(numberOfIndividuals, rewire, meanDegree);
    removeDuplicateEdges(graph);
    initGameSpace();

    d3.select("#customMenuDiv").remove();
    d3.select(".difficultySelection").remove();
    d3.select(".difficultySelection").remove();
}

function initGameSpace() {
    loadGameSyringe();

    vaccinateMode     = false ;
    quarantineMode    = false ;
    numberVaccinated  = 0     ;
    numberQuarantined = 0     ;

    gameSVG = d3.select("body").append("svg")
        .attr({
            "width": "100%",
            "height": "87.5%"  //footer takes ~12.5% of the page
        })
        .attr("viewBox", "0 0 " + width + " " + height )
        .attr("class", "gameSVG")
        .attr("pointer-events", "all")
        .append('svg:g');


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
        .on("click", gameClick);
}

function nodeSize(node) {
    var size = 8;
    // property-based sizing of nodes go here, if any
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
            node.status = "Q";
            numberQuarantined++;
            gameTimesteps();
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

function gameUpdate() {
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
        .attr("r", 8)
        .style("fill", nodeColor);

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 8)
        .style("fill", nodeColor)
        .on("click", gameClick)
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();



    if (!diseaseIsSpreading && numberQuarantined == 1) {
        diseaseIsSpreading = true;
        gameTimesteps();
    }
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

    if (timeToStop && !diseaseIsSpreading) {
        tallySaved();
        //d3.select(".gameSVG").select("g").style("visibility","hidden")

    }
}

function tallySaved() {
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        if (node.status == "S") numberSaved++;
    }
}

function detectGameCompletion() {
    if (timeToStop || !diseaseIsSpreading) return;

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
        animateGamePathogens_thenUpdate()

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
            var size = 8;
            if (d.status == "I") {
                if (timestep - d.exposureTimestep == 1) size = 12;
            }
            return size;
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
        .style("font-size", 16)
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
        .style("font-size", 16)
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

function initScoreRecap() {
    d3.select(".gameSVG").select("g").style("visibility", "hidden")
    hideGameQuarantine();

    // details - left
    d3.select(".gameSVG").append("text")
        .attr("class", "networkSizeText")
        .attr("x", backX)
        .attr("y", 195)
        .text("Network Size: " + numberOfIndividuals);

    d3.select(".gameSVG").append("text")
        .attr("class", "numberQuarantinedText")
        .attr("x", backX)
        .attr("y", 230)
        .text("Quarantined: " + numberQuarantined)

    d3.select(".gameSVG").append("text")
        .attr("class", "numberVaccinatedText")
        .attr("x", backX)
        .attr("y", 265)
        .attr("opacity", 1)
        .text("Vaccinated: " + numberVaccinated)

    d3.select(".gameSVG").append("text")
        .attr("class", "numberUntreatedText")
        .attr("x", backX)
        .attr("y", 300)
        .attr("opacity", 1)
        .text("Untreated: " + numberSaved)

    infectedHeight = (1.00 - ((numberVaccinated+numberQuarantined+numberSaved)/numberOfIndividuals).toFixed(2)) * (400);
    uninfectedHeight = ((numberVaccinated+numberQuarantined+numberSaved)/numberOfIndividuals).toFixed(2) * (400)

    uninfectedBar = d3.select(".gameSVG").append("rect")
        .attr("class", "uninfectedBar")
        .attr("x", 1200)
        .attr("y", 175)
        .attr("height", uninfectedHeight)
        .attr("width", 100)
        .attr("opacity", 0)
        .attr("fill", "#b7b7b7")

    centerElement(uninfectedBar, "uninfectedBar")
    uninfectedBar.attr("opacity", 1)

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




    // legend - right
    d3.select(".gameSVG").append("text")
        .attr("class", "uninfectedLegendText")
        .attr("x", backX + 550)
        .attr("y", 195)
        .text("Uninfected")

    d3.select(".gameSVG").append("text")
        .attr("class", "infectedLegendText")
        .attr("x", backX + 550)
        .attr("y", 245)
        .text("Infected")

    d3.select(".gameSVG").append("text")
        .attr("class", "uninfectedPercentage")
        .attr("x", backX + 675)
        .attr("y", 195)
        .text(Math.round((((numberSaved + numberQuarantined + numberVaccinated)/numberOfIndividuals)*100)).toFixed(0) + "%")

    d3.select(".gameSVG").append("rect")
        .attr("class", "uninfectedLegendBox")
        .attr("x", backX + 521)
        .attr("y", 177)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#b7b7b7")

    d3.select(".gameSVG").append("rect")
        .attr("class", "infectedLegendBox")
        .attr("x", backX + 521)
        .attr("y", 227)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#ef5555")

}
