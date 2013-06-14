var quarantineGame = angular.module('quarantineGame', []);

quarantineGame.controller('quarantineGameCTRL', ['$scope',function($scope) {

}])

//initialize constants
var groupCounter = 0;
var numberOfCommunities = null;
var G = jsnx.Graph();
var largestCommunity = null;
var communities = [];
var vaccinesUsed = null;
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
var graph = generateSmallWorld(numberOfIndividuals,rewire,meanDegree);
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

// generate the force diagram and initialize parameters and start motion
var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(graph.links)
    .size([width, height])
    .charge(charge)
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
    .attr("r", 8)
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
    .on("click", clickQuarantine);

// attach popover
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function clickQuarantine(node) {
    if (node.status == "S") node.status = "V";
    update();
}

function update() {
    infection();
    stateChanges();
    tallyStatuses();
    this.timestep++;

    checkForCompletion();
    updateCommunities();
    findLargestCommunity();
    updateFullGraph();
    updateNodeAttributes();
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
        .attr("r", 8)
        .style("fill", color)
        .on("click", clickQuarantine)
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    graph.nodes = nodes;
    graph.links = links;
}


updateCommunities();
convertGraphForNetX();
findLargestCommunity();




