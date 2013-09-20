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
var friction = 0.90;

initFooter();
initBasicMenu();

function initBasicGame(difficulty) {
    d3.select(".difficultySelection").remove();
    d3.select(".newGameHeader").remove();


    graph             = {}    ;
    graph.nodes       = []    ;
    graph.links       = []    ;
    vaccinationMode   = true  ;
    quarantineMode    = false ;
    numberVaccinated  = 0     ;
    numberQuarantined = 0     ;

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

}

function initGameSpace() {
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
    if (vaccinationMode) {
        node.status = "V";
        numberOfVaccines--;
        numberVaccinated++;
    }
    else {
        if (quarantineMode && node.status == "S") {
            node.status = "Q";
            numberQuarantined++;
        }
    }
    console.log(node)
    gameUpdate();
}

function gameUpdate() {
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

}


// tick function, which does the physics for each individual node & link.
function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

