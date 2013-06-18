var preVaccination  = true;
var sizeByDegree    = false;
var submitted       = false;
var sizeByBC        = false;
var twine = [];
var twineIndex = 0;
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
var charge = n * -2;

var stars = 1;
var refusers = [];
var net_id = 0;

var preventGame = angular.module('preventGame', []);

var preventGameCTRL = ['$scope',function($scope) {
    $scope.vaccinated = [];

    $scope.toggleDegree = function() {
        toggleDegree();
        updateNodeAttributes();

    }

    $scope.toggleBC = function() {
        toggleBC();
        updateNodeAttributes();

    }

    $scope.vaccinesUsed = 0;
    $scope.communityCompletion = 0;
    $scope.largestCompletion = 0;
    $scope.sim_size = estimateWorstCase();
    $scope.vaccinesToBeUsed = 0;
    $scope.numberOfCommunities = numberOfCommunities;
    $scope.largestCommunity = largestCommunity;
    $scope.targetWorstCase = targetEstimate;

    $scope.vaccinate = function() {
        vaccinate();
        combinedUpdate();
        $scope.vaccinesUsed = getNumberOfVaccinesUsed();
        $scope.completion = updateCompletions();
        $scope.numberOfCommunities = numberOfCommunities;
        $scope.largestCommunity = largestCommunity;
        $scope.sim_size = worstCase;
        $scope.targetWorstCase = targetEstimate;
    }

    $scope.finalize = function() {
        $scope.vax = finalize();
        $scope.sim_size = worstCase;
        $scope.stars = stars;
        $scope.refusers = refusers;
        $scope.net_id = net_id;
    }

}];


function finalize() {
    var vaccinated = [];
    for (var i = 0; i < originalGraph.nodes.length; i++) {
        var node = originalGraph.nodes[i];
        if (node.status == "V") vaccinated.push(node.id);
    }
    return vaccinated;
}

function updateCompletions() {
    worstCase = estimateWorstCase();
    completion = (100 - (worstCase - targetEstimate));
    return completion;

}

function getNumberOfVaccinesUsed() {
    vaccinesUsed = 0;
    for (var i = 0; i < originalGraph.nodes.length; i++) {
        if (originalGraph.nodes[i].status == "V") vaccinesUsed++;
    }
    return vaccinesUsed;
}

function estimateWorstCase() {
    var sumSquared = 0;
    var sum = 0;
    var worstCase = 0;
    for (var i = 0; i < communities.length; i++) {
        sumSquared += communities[i] * communities[i];
        sum += communities[i];
    }
    worstCase = sumSquared / sum;
    worstCase =  parseFloat(Math.round(worstCase * 100) / 100).toFixed(2)
    return worstCase;

}

// make graph object
// nodes are basic individuals with IDs from 0-19
// edges/links are in JSON format.  Note that prior node IDs must match link IDs


var graph = generateSmallWorld(n,0.10,3);


function readJSON(json) {
    for (var i = 0; i < json.graph.nodes; i++) {
        graph.nodes[i] = json.graph.nodes[i];
    }
    for (var ii = 0; ii < json.graph.links; ii++) {
        graph.links[ii] = json.graph.links[ii];
    }
}



var groupCounter = 0;
var originalGraph = owl.deepCopy(graph);

// select "body" section, and append an empty SVG with height and width values
var width = 700,
    height = 600,
    svg;

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("weight", height)
    .attr("pointer-events", "all")
    .append('svg:g')
    .call(d3.behavior.zoom().on("zoom", redraw))




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
    .on("click", clickPrevent);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function combinedUpdate() {
    updateCommunities();
    findLargestCommunity();
    updateCompletions();
    if (preVaccination) {
        updateNodeAttributes();
    }
    else {
        bcScores = computeBetweennessCentrality();
        updateFullGraph();
        updateNodeAttributes();
    }
    preVaccination  = true;

}
function updateFullGraph() {
    var nodes = filterSusceptibleNodes(0);
    var links = filterLinks(0);
    charge -= n;
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
        .on("click", clickPrevent)
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    graph.nodes = nodes;
    graph.links = links;
}


function vaccinate() {
    preVaccination  = false;
    getNumberOfVaccinesUsed();
    combinedUpdate();
    updateCommunities();
    convertGraphForNetX();
}




updateCommunities();
convertGraphForNetX();
bcScores = computeBetweennessCentrality();
findLargestCommunity();

