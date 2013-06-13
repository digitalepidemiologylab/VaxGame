var game = angular.module('quarantineGame', []);

game.controller('quarantineGameCTRL', ['$scope',function($scope) {

    $scope.vaccinesUsed = 0;
    $scope.$watch.vaccinesUsed = vaccinesUsed;



}])


//initialize constants
var groupCounter = 0;
var preVaccination  = true;
var sizeByDegree    = true;
var submitted       = false;
var sizeByBC        = false;
var numberOfCommunities = null;
var G = jsnx.Graph();
var bcScores = [];
var largestCommunity = null;
var vaccinesUsed = null;
var communities = [];
var targetEstimate = 10;
var worstCase = 0;
var completion = 0;
var n = 50;

var stars = 1;
var refusers = [];
var net_id = 0;


var numberOfIndividuals = 50;
var charge = -500;
var rewire = 0.10;
var meanDegree = 3;
var healthStatuses = [0,0,0,0,0];
var timestep = 0;
var transmissionRate = .50;
var latencyPeriod = 1;
var recoveryRate = .05;
var maxRecoveryTime = 7;


//initialize graph
var graph = generateSmallWorldForQuarantineGame(numberOfIndividuals,rewire,meanDegree);
var originalGraph = owl.deepCopy(graph);

//expose randomly selected index case
exposeIndividual(graph.nodes[Math.floor(Math.random() * numberOfIndividuals)]);
exposeIndividual(graph.nodes[Math.floor(Math.random() * numberOfIndividuals)]);
exposeIndividual(graph.nodes[Math.floor(Math.random() * numberOfIndividuals)]);


//initialize d3 draw area
var width = 700,
    height = 400,
    svg;

// select "body" section, and append an empty SVG with height and width values
svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("weight", height)
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('svg:g');

// function to redraw graph after drag/zoom
function redraw() {
    console.log("here", d3.event.translate, d3.event.scale);
    svg.attr("transform",
        "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
}

// generate the force diagram and initialize parameters and start motion
var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(graph.links)
    .size([width, height])
    .charge(charge)
    .on("tick", tick)
    .start();

// tick function, which does the physics for each individual node & link.
function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

// associate empty SVGs with link data. assign attributes.
var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");


// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.
var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", metric)
    .style("fill", color)
    .on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("NodeID:\t" + d.id + "<br/>" + "Neighbors:\t" +  degree(d) + "<br/>"  + "Centrality:\t" + parseFloat(Math.round(d.bcScore * 100) / 100).toFixed(2))
            .style("left", 500 + "px")
            .style("top", 200 + "px");
    })
    .on("mouseout", function(d) {
        div.transition()
            .duration(400)
            .style("opacity", 0)})
    .call(force.drag)
    .on("click", click);

// attach popover
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// color function
function color(d) {
    var color = null;
    if (d.status == "S") color = "#37FDFC";
    if (d.status == "V") color = "#000000";
    if (d.status == "E") color = "#ffe600";
    if (d.status == "I") color = "#ff0000";
    if (d.status == "R") color = "#9400D3";
    return color;
}

function update() {
    infection();
    stateChanges();
    tallyStatuses();
    this.timestep++;
    checkForCompletion();

    updateCommunities();
    findLargestCommunity();
    updateCompletions();
    updateFullGraph();
    updateNodeAttributes();


}

function filterSusceptibleNodes() {

    var nodes = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status != "V" && graph.nodes[i].status != "R" ) nodes.push(graph.nodes[i]);
    }
    return nodes;
}

function filterLinks() {
    var links = [];
    for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.status == "V" || graph.links[i].target.status == "V") {
            continue;
        }
        if (graph.links[i].source.status == "R" || graph.links[i].target.status == "R") {
            continue;
        }
        links.push(graph.links[i])
    }
    return links;
}

function updateFullGraph() {
    var nodes = filterSusceptibleNodes();
    var links = filterLinks();
    charge = charge - 10;
    force
        .nodes(nodes)
        .charge(charge)
        .links(links)
        .start();

    // select all links, join them with new data, and save it to "link" variable
    link = svg.selectAll("line.link")
        .data(links, function(d) { return d.source.id + "-" + d.target.id; });

    // enter new links (unnecessary at the moment)
    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(nodes, function(d) { return d.id; })
        .style("fill", color);

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", metric)
        .style("fill", color)
        .on("click", click)
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    graph.nodes = nodes;
    graph.links = links;
}


function updateNodeAttributes() {
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(graph.nodes, function(d) { return d.id; })
        .attr("r", metric)
        .style("fill", color);
}

function click(node) {
    if (node.status == "S") node.status = "V";
    vaccinesUsed++;
    update();
}

function metric(node) {
    node.degree = degree(node);
    var sizeByMetric = 8;
    if (sizeByBC == true && sizeByDegree == false) sizeByMetric = (node.bcScore / 0.025) + 6;
    if (sizeByBC == false && sizeByDegree == true) sizeByMetric = (node.degree + 2) * 2;
    if (sizeByBC == true && sizeByDegree == true) sizeByMetric = ((node.bcScore / 0.01) + 1) + ((node.degree + 2) * 2) / 2;
    return sizeByMetric;
}

function exposeIndividual(individual) {
    if (individual.status == "S") {
        individual.status = "E";
        individual.exposureTimestep = this.timestep;
    }
}

function exposedToInfected(individual) {
    if (individual.status != "E") return;
    var timeSinceExposure = this.timestep - individual.exposureTimestep;
    if (timeSinceExposure > latencyPeriod) individual.status = "I";
}

function infectedToRecovered(individual) {
    if (individual.status != "I") return;
    var timeSinceInfection = this.timestep - individual.infectiousTimestep;
    if (Math.random() < recoveryRate || timeSinceInfection > maxRecoveryTime) individual.status = "R";
}

function stateChanges() {
    for (var index = 0; index < graph.nodes.length; index++) {
        var individual = graph.nodes[index];
        exposedToInfected(individual);
        infectedToRecovered(individual);
    }
}

function resetSim() {
    this.timestep = 0;
    this.diseaseIsSpreading = true;
    this.healthStatuses = [0,0,0,0,0];
    for (var index = 0; index < graph.nodes.length; index++) {
        var individual = graph.nodes[index];
        if (individual.status == "V") continue;
        if (individual.status == "R") individual.timesInfected++;
        individual.exposureTimestep = null;
        individual.infectiousTimestep = null;
        individual.status = "S";
    }
}

function checkForCompletion() {
    if (healthStatuses[1] == 0 && healthStatuses[2] == 0) diseaseIsSpreading = false;

}

function tallyStatuses() {
    var healthStatuses = [0,0,0,0,0];
    for (var index = 0; index < graph.nodes.length; index++) {
        if (graph.nodes[index].status == "S") healthStatuses[0]++;
        if (graph.nodes[index].status == "E") healthStatuses[1]++;
        if (graph.nodes[index].status == "I") healthStatuses[2]++;
        if (graph.nodes[index].status == "R") healthStatuses[3]++;
        if (graph.nodes[index].status == "V") healthStatuses[4]++;
    }
    this.healthStatuses = healthStatuses;
}

function infection() {
    for (var index = 0; index < graph.nodes.length; index++) {
        if (graph.nodes[index].status != "S") continue;
        var susceptible = graph.nodes[index];
        var neighbors = findNeighbors(susceptible);
        var numberOfInfectedNeighbors = 0;
        for (var neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
            var neighbor = neighbors[neighborIndex];
            if (neighbor.status == "I") {
                numberOfInfectedNeighbors++;
            }
        }
        var probabilityOfInfection = 1.0 - Math.pow(1.0 - transmissionRate,numberOfInfectedNeighbors);
        if (Math.random() < probabilityOfInfection) exposeIndividual(susceptible);
    }
}


function updateCompletions() {
    worstCase = estimateWorstCase();
    console.log(worstCase + "\t" + targetEstimate)
    completion = (100 - (worstCase - targetEstimate));
    console.log(completion);
    return completion;

}


updateCommunities();
convertGraphForNetX();
bcScores = computeBetweennessCentrality();
findLargestCommunity();




