var widthBay = 500;
var heightBay = 250;
var numberOfIndividuals = 50;
var rewire = 0.10;
var meanDegree = 3;
var charge = -100;
var G;
var outbreakDetected = false;

var vaccineResearched = false;
var vaccineSupply = 0;

var epidemicAnnounced = false;
var newRefusers = 0;
var newAdopters = 0;

var martialLawDeclared = false;
var brokenTies = 0;

var vaccinateMode = true;
var treatMode = false;
var quarantineMode = false;

var toggleDegree = false;
var toggleCentrality = false;

var timestep = 0;
var transmissionRate = .25;
var recoveryRate = .03;
var maxRecoveryTime = 4;
var indexCase = null;
var treatmentEfficacy = 0.25;               // likelihood that treatment will result in immediate cure
var hospitalQuarantineEfficacy = 0.50;      // proportion of edges, per individual, that are severed upon treatment
var martialLaw_edgeRemovalFrequency = 0.25; // proportion of edges, in entire graph, that are severed upon martial law
var rateOfVoluntarySegregation = 0.10;
var rateOfRefusalAdoption = 0.10;
var s_series = [];
var i_series = [];
var r_series = [];
var simulation = true;
var diseaseIsSpreading = false;
var sim_series = [];
var endGame = false;

// necessary hack to stop interference from tutorial
guideRailsPosition = 100;


d3.select("body").append("div0")

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

//draw "HUD"
var vaccineSupplyHUD = d3.select(".networkSVG").append("text")
    .attr("class", "vaccineSupplyHUD")
    .attr("x",20).attr("y",25)
    .text("");

var dayTickerHUD = d3.select(".networkSVG").append("text")
    .attr("class", "dayTickerHUD")
    .attr("x",435).attr("y",25)
    .text("Day: " + timestep);


// draw the legend
var nodeY = 490;
var textY = 495;
var susceptibleNode = d3.select(".networkSVG").append("circle")
    .attr("class", "susceptibleNode")
    .attr("cx",30).attr("cy",nodeY)
    .style("stroke", 10)
    .attr("r", 8)
    .attr("fill", "#37FDFC")

var susceptibleText = d3.select(".networkSVG").append("text")
    .attr("class", "susceptibleText")
    .attr("x",40).attr("y",textY)
    .text("Susceptible")

var exposedNode = d3.select(".networkSVG").append("circle")
    .attr("class", "exposedNode")
    .attr("cx",135).attr("cy",nodeY)
    .attr("r", 8)
    .style("stroke", 10)
    .attr("fill", "#DB3248")

var exposedText = d3.select(".networkSVG").append("text")
    .attr("class", "exposedText")
    .attr("x",145).attr("y",textY)
    .text("Exposed")

var infectedNode = d3.select(".networkSVG").append("circle")
    .attr("class", "infectedNode")
    .attr("cx",220).attr("cy",nodeY)
    .attr("r", 8)
    .style("stroke", 10)
    .attr("fill", "#FF0000")

var infectedText = d3.select(".networkSVG").append("text")
    .attr("class", "infectedText")
    .attr("x",230).attr("y",textY)
    .text("Infected")

var recoveredNode = d3.select(".networkSVG").append("circle")
    .attr("class", "recoveredNode")
    .attr("cx",305).attr("cy",nodeY)
    .attr("r", 8)
    .style("stroke", 10)
    .attr("fill", "#9400D3")

var recoveredText = d3.select(".networkSVG").append("text")
    .attr("class", "recoveredText")
    .attr("x",315).attr("y",textY)
    .text("Recovered")

var vaccinatedNode = d3.select(".networkSVG").append("circle")
    .attr("class", "vaccinatedNode")
    .attr("cx",405).attr("cy",nodeY)
    .attr("r", 8)
    .style("stroke", 10)
    .attr("fill", "#FFFF00")

var vaccinatedText = d3.select(".networkSVG").append("text")
    .attr("class", "vaccinatedText")
    .attr("x",415).attr("y",textY)
    .text("Vaccinated")



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
    .style("stroke", 10)
    .style("fill", color)
//    .on("mouseover", mouseOver)
//    .on("mouseout", mouseOut)
    .call(force.drag)
    .on("click", click);



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
    var nodes = removeVaccinatedNodes(graph);
    var links = removeOldLinks(graph);

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

    d3.select(".vaccineSupplyHUD")
        .text("Vaccines: " + vaccineSupply);

    d3.select(".dayTickerHUD")
        .text("Day: " + timestep);
}

initGraphMeasures();

function initGraphMeasures() {
    console.log(graph);
    graph = assignEdgeListsToNodes(graph);
    updateCommunities(graph);
    G = convertGraphForNetX(graph);
    assignDegree();
    bcScores = computeBetweennessCentrality();
    findLargestCommunity();
}






