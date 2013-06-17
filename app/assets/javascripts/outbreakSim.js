
var timestep = 0;
var transmissionRate = .1;
var latencyPeriod = 2;
var recoveryRate = .03;
var maxRecoveryTime = 7;
var indexCase = null;
var diseaseIsSpreading = false;
var healthStatuses = [0,0,0,0,0];
var totalSims = 50;

var graph = generateSmallWorldForOutbreak(50, 0.10, 4);

function selectIndexCase() {
    var numberOfPeople = graph.nodes.length;

    do{
        var randomIndex = Math.floor(Math.random() * numberOfPeople);
        var indexCase = graph.nodes[randomIndex];
    }
    while (indexCase.status == "V");

    this.indexCase = indexCase;
    exposeIndividual(this.indexCase);
    this.diseaseIsSpreading = true;
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

function runTimesteps() {
    while(diseaseIsSpreading) {
        infection();
        stateChanges();
        tallyStatuses();
        this.timestep++;
        checkForCompletion();
    }
}

function multiBioSims() {
    for (var simCounter = 0; simCounter < totalSims; simCounter++) {
        selectIndexCase();
        runTimesteps();
        resetSim();
        updateNodeAttributes();
    }
    resetSim();
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

// select "body" section, and append an empty SVG with height and width values
var width = 1000,
    height = 500,
    svg;
svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("weight", height)
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('svg:g');



function redraw() {
    console.log("here", d3.event.translate, d3.event.scale);
    svg.attr("transform",
        "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
}

// initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(graph.links)
    .size([width, height])
    .charge(-300)
    .on("tick", tick)
    .start();

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
    .attr("r", 10)
    .style("fill", color)
    .on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("NodeID:\t" + d.id + "<br/>" + "Status:\t" + status(d) + "<br/>" + "Risk:\t" + (100*d.timesInfected/totalSims) + "%")
            .style("left", 600 + "px")
            .style("top", 150 + "px");
    })
    .on("mouseout", function(d) {
        div.transition()
            .duration(400)
            .style("opacity", 0)})
    .call(force.drag)


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//var texts = svg.selectAll("text.label")
//    .data(graph.nodes)
//    .enter().append("text")
//    .attr("class", "label")
//    .attr("fill", "black")
//    .text(text)

// tick function, which does the physics for each individual node & link.
function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

//    texts.attr("transform", function(d) {
//        return "translate(" + (d.x-9) + "," + (d.y+5) + ")";
//    });
}

function updateNodeAttributes() {
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .charge(-300)
        .start();



    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(graph.nodes, function(d) { return d.id; })
        .attr("r", size)
        .style("fill", color)

//
//    texts = svg.selectAll("text.label")
//        .data(graph.nodes, function(d) { return d.timesInfected})
//        .text(text);
}

function text(d) {
    var text = " ";
    if (d.status == "V") return text;
    else return d.timesInfected + "x";
}

function size(d) {
    if (d.status == "V") return 10;
    else {
        return (d.timesInfected + 3);
    }
}

function status(d) {
    var statusString = null;
    if (d.status == "S")  statusString = "susceptible";
    if (d.status == "V")  statusString = "vaccinated";
    return statusString;
}

function color(d) {
    var color = null;
    if (d.status == "S") color = "#ff0000";
    if (d.status == "V") color = "#c6dbef";
    return color;
}

multiBioSims();



