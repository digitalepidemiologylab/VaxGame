var numberOfIndividuals = 50;
var rewire = 0.10;
var meanDegree = 3;
var charge = -50;
var outbreakGame = angular.module('outbreakGame', []);
var currentColorBC = "black";
var currentColorDeg = "black";

var graph = generateSmallWorld(numberOfIndividuals,rewire,meanDegree);
var originalGraph = owl.deepCopy(graph);


// select "body" section, and append an empty SVG with height and width values
var width = 500,
    height = 500,
    svg;

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "networkSVG")
    .attr("pointer-events", "all")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('svg:g');

// initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
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
    .attr("r", metric)
    .style("fill", color)
//    .on("mouseover", mouseOver)
//    .on("mouseout", mouseOut)
    .call(force.drag)
    .on("click", click);

//var div = d3.select("body").append("div")
//    .attr("class", "tooltip")
//    .style("opacity", 0);


// necessary for drag & zoom
function redraw() {
    svg.attr("transform",
        "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
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


function updateNodeAttributes() {
    var charge = null;
    if (toggleDegree == false) {
        if (toggleCentrality == false) charge = -50;   // both false, basic
        if (toggleCentrality == true) charge = -50;  // only bc
    }
    else {
        if (toggleCentrality == true) charge = -75; // both true, composite
        if (toggleCentrality == false) charge =  -50; // only degree
    }

    force
        .nodes(graph.nodes)
        .charge(charge)
        .links(graph.links)
        .start();

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(graph.nodes, function(d) { return d.id; })
        .attr("r", metric)
        .style("fill", color);


}



function updateGraph() {
    var nodes = removeVaccinatedNodes();
    var links = removeOldLinks();

    charge -= numberOfIndividuals / 2;

    force
        .nodes(nodes)
        .charge(charge)
        .links(links)
        .start();

    link = svg.selectAll("line.link")
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

initGraphMeasures();

function initGraphMeasures() {
    assignEdgeListsToNodes();
    updateCommunities();
    convertGraphForNetX();
    assignDegree();
    this.bcScores = computeBetweennessCentrality();
    findLargestCommunity();
}






