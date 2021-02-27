var rewire = 0.10;
var meanDegree = 3;
var diseaseIsSpreading = false;
var transmissionRate = .35;
var recoveryRate = 0;
var maxRecoveryTime = 1000000;
var numberVaccinated = 0;
var timeToStop = true;
var guideRailsPosition = 0;
var postInitialOutbreak = false;
var finalStop = false;
var endGame = false;
var intervention = false;
var tutorial = false;
var charge = -400;
var newInfections = [];
var xyCoords = [];
var vax = 1;
var currentFlash = 0;
var keepFlashing = true;
var xFlashCounter = 0;
var numberQuarantined = 0;
var vaccineSupply = 0;
var vaccinateMode = false;
var quarantineMode = false;
var twine = [];
var twineIndex = 0;
var numberOfCommunities = null;
var largestCommunity = null;
var communities = [];
var groupCounter = 1;
var bcScores = [];
var timestep = 0;
var indexCase = null;
var opacityIndex = 0;
var lessonText;
var start = false;
var nextX = 800;
var nextY = 140;
var guideXCoord = 400;
var guideYCoord = 70;
var guide2YCoordChange = 35;
var width = 950,
    height = 768 - 45 - 50,  // standard height - footer:height - footer:bottomMargin
    svg;
var guideTextSVG;
var force, link, node;
var friction = 0.90;
var backX = 115;
var numberSaved = 0;
var infectedBar;
var uninfectedBar;
var exposureEdges = [];
var simulation = true;
var vaccineResearched = false;
var pleaseWait = false;
var game = false;

var startButton;

function frontTick() {

    frontNode.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 50, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min(500 - 50, d.y)); });


    frontLink.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });


}

function generateFrontGraph() {
    var frontCharge = -30000;

    frontGraph = {};
    frontNodes = [{id:0}, {id:1}, {id:2}, {id:3}];

    frontLinks = [

    {
        source:frontNodes[0],
        target:frontNodes[1]
    },

    {
        source:frontNodes[1],
        target:frontNodes[2]
    },

    {
        source:frontNodes[2],
        target:frontNodes[0]
    },

    {
        source:frontNodes[1],
        target:frontNodes[3]
    }
    ];

    frontGraph.nodes = frontNodes;
    frontGraph.links = frontLinks;

    frontForce = d3.layout.force()
        .nodes(frontGraph.nodes)
        .links(frontGraph.links)
        .size([width, height])
        .charge(frontCharge)
        .friction(0.80)
        .on("tick", frontTick)
        .start();

// associate empty SVGs with link data. assign attributes.
    frontLink = homeSVG.selectAll(".link")
        .data(frontGraph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("fill", "#707070")
        .style("stroke-width", "10px")
        .style("stroke", "#d5d5d5")

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.
    frontNode = homeSVG.selectAll(".node")
        .data(frontGraph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 50)
        .style("stroke", "#b7b7b7")
        .style("stroke-width", "10px")
        .attr("fill", function(d) {
            if (d.id == 3) return "#f1d2d2"
            else return "#d5d5d5"
        })
        .call(frontForce.drag)


}

var homeSVG = d3.select("body").append("svg")
    .attr("class", "homeSVG")
    .attr({
        "width": "100%",
        "height": "87.5%"  //footer takes ~12.5% of the page
    })
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("pointer-events", "all")
    .style("position", "absolute")

generateFrontGraph();

d3.select(".homeSVG").append("text")
    .attr("class", "homeTitle")
    .attr("x", 390)
    .attr("y", 265)
    .attr("fill", "#707070")
    .text("Hola Fran!")

d3.select(".homeSVG").append("text")
    .attr("class", "homeText")
    .attr("x", 275)
    .attr("y", 315)
    .attr("fill", "#707070")
    .text("Un juego sobre prevención epidemiológica.")

d3.select(".homeSVG").append("text")
    .attr("class", "homeTutorial")
    .attr("x", 802)
    .attr("y", 525)
    .attr("fill", "#707070")
    .on("mouseover", function(d) {

        d3.select(this).style("fill", "#2692F2")

    })
    .on("mouseout", function(d) {
        d3.select(this).style("fill", "#707070")
    })
    .text("Tour >")
    .on("click", function() {
        window.location.href = '/tour'
   })

d3.select(".homeSVG").append("text")
    .attr("class", "homeGame")
    .attr("x", 794)
    .attr("y", 558)
    .attr("fill", "#707070")
    .text("Jugar >")
    .on("mouseover", function(d) {

        d3.select(this).style("fill", "#2692F2")

    })
    .on("mouseout", function(d) {
        d3.select(this).style("fill", "#707070")
    })
    .on("click", function() {
        window.location.href = '/game'
    })

d3.select(".homeSVG").append("text")
    .attr("class", "homeHI")
    .attr("x", 630)
    .attr("y", 590)
    .attr("fill", "#707070")
    .attr("font-size", "23px")
    .style("font-family", "Nunito")
    .style("cursor", "pointer")
    .text("Inmunidad de rebaño >")
    .on("mouseover", function(d) {

        d3.select(this).style("fill", "#2692F2")

    })
    .on("mouseout", function(d) {
        d3.select(this).style("fill", "#707070")
    })
    .on("click", function() {
        window.location.href = '/herdImmunity'
    })
