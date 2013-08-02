var numberOfIndividuals = 100;
var rewire = 0.10;
var meanDegree = 3;
var charge = -100;
var outbreakGame = angular.module('outbreakGame', []);
var currentColorBC = "black";
var currentColorDeg = "black";

//
//var outbreakGameCTRL = ['$scope', '$timeout',function($scope, $timeout) {
//    updateCommunities();
//    findLargestCommunity();
//    $scope.numberOfCommunities = numberOfCommunities;
//    $scope.largestCommunity = largestCommunity;
//    $scope.vaccinesRemaining = vaccineSupply;
//    $scope.detectOutbreak_disable = true;
//    $scope.researchVaccine_disable = false;
//    $scope.martialLaw_disable = true;
//    $scope.publicAnnouncement_disable = true;
//    $scope.vaccination_disable = true;
//    $scope.quarantine_disable = true;
//    $scope.treat_disable = true;
//    $scope.recentUpdate = "";
//    $scope.previousUpdates = [];
//
//    var updateUI = function() {
//        updateCommunities();
//        findLargestCommunity();
//        $scope.largestCommunity = largestCommunity;
//        $scope.numberOfCommunities = numberOfCommunities;
//        $scope.vaccinesRemaining = vaccineSupply;
//        $timeout(updateUI, 1000);
//        $scope.recentUpdate = recentUpdate;
//        $scope.previousUpdates = previousUpdates;
//
//        if (vaccineSupply > 0) $scope.vaccination_disable = false;
//    }
//    $timeout(updateUI, 1000);
//
//    $scope.researchVaccine = function() {
//        vaccineResearched = true;
//        vaccineSupply = 5;
//        $scope.researchVaccine_disable = true;
//        $scope.detectOutbreak_disable = false;
//        timestep = 0;
//        runTimesteps();
//    }
//
//    $scope.detectOutbreak = function() {
//        if (diseaseIsSpreading) {
//            if (Math.random() < 0.50) {
//                outbreakDetected = true;
//                $scope.detectOutbreak_disable = true;
//                setRecentUpdate("Outbreak Detected!")
//                $scope.publicAnnouncement_disable = false;
//                $scope.martialLaw_disable = false;
//                $scope.quarantine_disable = false;
//                $scope.treat_disable = false;
//            }
//        }
//        else {setRecentUpdate("No Outbreak Detected.")};
//        updateGraph();
//
//
//    }
//
//    $scope.makePublicAnnouncement = function() {
//        makePublicAnnouncement();
//        updateNodeAttributes();
//        $scope.publicAnnouncement_disable = true;
//    }
//
//    $scope.declareMartialLaw = function() {
//        declareMartialLaw();
//        updateGraph();
//        $scope.martialLaw_disable = true;
//    }
//
//    $scope.toggleSizeByDegree = function() {
//        toggleSizeByDegree();
//    }
//
//    $scope.toggleSizeByBC = function() {
//        toggleSizeByBC();
//    }
//
//    $scope.checkVaccinate = function() {
//        toggleVaccinate();
//    }
//
//    $scope.checkQuarantine = function() {
//        toggleQuarantine();
//    }
//
//    $scope.checkTreatment = function() {
//        toggleTreatment();
//    }
//
//    $scope.submit = function() {
//        startGame();
//        $scope.vaccinesRemaining = vaccineSupply;
//        updateCommunities();
//        findLargestCommunity();
//        $scope.numberOfCommunities = numberOfCommunities;
//        $scope.largestCommunity = largestCommunity;
//    }
//
//
//
//}];

//$('#medical > button.active').text();


var graph = generateSmallWorld(numberOfIndividuals,rewire,meanDegree);
var originalGraph = owl.deepCopy(graph);


// select "body" section, and append an empty SVG with height and width values
var width = 700,
    height = 600,
    svg;

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("weight", height)
    .attr("pointer-events", "all")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('svg:g');

// initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(graph.links)
    .size([width, 450])
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
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    .call(force.drag)
    .on("click", click);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);





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

    try{
        texts.attr("transform", function(d) {
            return "translate(" + (d.x-9) + "," + (d.y+5) + ")"
        });
    }
    catch(e){
        //catch and just suppress error
    }

}


function updateNodeAttributes() {
    var charge = null;
    if (toggleDegree == false) {
        if (toggleCentrality == false) charge = -150;   // both false, basic
        if (toggleCentrality == true) charge = -200;  // only bc
    }
    else {
        if (toggleCentrality == true) charge = -300; // both true, composite
        if (toggleCentrality == false) charge =  -200; // only degree
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






