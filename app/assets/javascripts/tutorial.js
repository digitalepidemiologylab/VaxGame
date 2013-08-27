var rewire = 0.10;
var meanDegree = 3;
var diseaseIsSpreading = false;
var transmissionRate = .25;
var recoveryRate = 0;
var maxRecoveryTime = 1000;
var vaccinateMode = false;
var numberVaccinated = 0;
var timeToStop = false;
var guideRailsPosition = 0;
var postInitialOutbreak = false;
var finalStop = false;
var endGame = false;
var nonIntervention_series = [];
var intervention_series = [];
var intervention = false;
var tutorial = false;
var charge = -1000;
var newInfections = [];
var xyCoords = [];
var vax = 1;


var graph = {};
var tailoredGraph = {};
var tailoredNodes= [];
var tailoredLinks = [];

for (var ii = 0; ii < 13; ii++) {
    var nodeString = {id:ii+13, status:"S", group:null, edges:[], marked:false, degree:null, bcScore:null, exposureTimestep:null, infectedBy:null};
    tailoredNodes.push(nodeString);
}
var numberOfIndividuals = tailoredNodes.length;


tailoredLinks = [
    {
        source:tailoredNodes[13-13],
        target:tailoredNodes[14-13],
        remove:false
    },
    {
        source:tailoredNodes[13-13],
        target:tailoredNodes[17-13],
        remove:false
    },
    {
        source:tailoredNodes[13-13],
        target:tailoredNodes[18-13],
        remove:false
    },
    {
        source:tailoredNodes[13-13],
        target:tailoredNodes[25-13],
        remove:false
    },
    {
        source:tailoredNodes[14-13],
        target:tailoredNodes[13-13],
        remove:false
    },
    {
        source:tailoredNodes[14-13],
        target:tailoredNodes[25-13],
        remove:false
    },
    {
        source:tailoredNodes[14-13],
        target:tailoredNodes[15-13],
        remove:false
    },
    {
        source:tailoredNodes[14-13],
        target:tailoredNodes[20-13],
        remove:false
    },
    {
        source:tailoredNodes[14-13],
        target:tailoredNodes[23-13],
        remove:false
    },
    {
        source:tailoredNodes[17-13],
        target:tailoredNodes[13-13],
        remove:false
    },
    {
        source:tailoredNodes[17-13],
        target:tailoredNodes[18-13],
        remove:false
    },
    {
        source:tailoredNodes[17-13],
        target:tailoredNodes[19-13],
        remove:false
    },
    {
        source:tailoredNodes[18-13],
        target:tailoredNodes[13-13],
        remove:false
    },
    {
        source:tailoredNodes[18-13],
        target:tailoredNodes[17-13],
        remove:false
    },
    {
        source:tailoredNodes[18-13],
        target:tailoredNodes[19-13],
        remove:false
    },
    {
        source:tailoredNodes[25-13],
        target:tailoredNodes[13-13],
        remove:false
    },
    {
        source:tailoredNodes[25-13],
        target:tailoredNodes[14-13],
        remove:false
    },
    {
        source:tailoredNodes[25-13],
        target:tailoredNodes[15-13],
        remove:false
    },
    {
        source:tailoredNodes[25-13],
        target:tailoredNodes[16-13],
        remove:false
    },
    {
        source:tailoredNodes[15-13],
        target:tailoredNodes[14-13],
        remove:false
    },
    {
        source:tailoredNodes[15-13],
        target:tailoredNodes[25-13],
        remove:false
    },
    {
        source:tailoredNodes[15-13],
        target:tailoredNodes[23-13],
        remove:false
    },
    {
        source:tailoredNodes[15-13],
        target:tailoredNodes[16-13],
        remove:false
    },
    {
        source:tailoredNodes[15-13],
        target:tailoredNodes[21-13],
        remove:false
    },
    {
        source:tailoredNodes[15-13],
        target:tailoredNodes[22-13],
        remove:false
    },
    {
        source:tailoredNodes[15-13],
        target:tailoredNodes[24-13],
        remove:false
    },
    {
        source:tailoredNodes[20-13],
        target:tailoredNodes[14-13],
        remove:false
    },
    {
        source:tailoredNodes[23-13],
        target:tailoredNodes[14-13],
        remove:false
    },
    {
        source:tailoredNodes[23-13],
        target:tailoredNodes[15-13],
        remove:false
    },
    {
        source:tailoredNodes[23-13],
        target:tailoredNodes[21-13],
        remove:false
    },
    {
        source:tailoredNodes[16-13],
        target:tailoredNodes[25-13],
        remove:false
    },
    {
        source:tailoredNodes[16-13],
        target:tailoredNodes[15-13],
        remove:false
    },
    {
        source:tailoredNodes[16-13],
        target:tailoredNodes[21-13],
        remove:false
    },
    {
        source:tailoredNodes[16-13],
        target:tailoredNodes[19-13],
        remove:false
    },
    {
        source:tailoredNodes[21-13],
        target:tailoredNodes[15-13],
        remove:false
    },
    {
        source:tailoredNodes[21-13],
        target:tailoredNodes[23-13],
        remove:false
    },
    {
        source:tailoredNodes[21-13],
        target:tailoredNodes[16-13],
        remove:false
    },
    {
        source:tailoredNodes[21-13],
        target:tailoredNodes[22-13],
        remove:false
    },
    {
        source:tailoredNodes[22-13],
        target:tailoredNodes[15-13],
        remove:false
    },
    {
        source:tailoredNodes[22-13],
        target:tailoredNodes[21-13],
        remove:false
    },
    {
        source:tailoredNodes[24-13],
        target:tailoredNodes[15-13],
        remove:false
    },
    {
        source:tailoredNodes[19-13],
        target:tailoredNodes[17-13],
        remove:false
    },
    {
        source:tailoredNodes[19-13],
        target:tailoredNodes[18-13],
        remove:false
    },
    {
        source:tailoredNodes[19-13],
        target:tailoredNodes[16-13],
        remove:false
    }
]

tailoredGraph.nodes = tailoredNodes;
tailoredGraph.links = tailoredLinks;

graph.nodes = tailoredNodes;
graph.links = tailoredLinks;
var player = graph.nodes[0];
trivialGraph = {};
trivialGraph.nodes = [];
trivialGraph.links = [];

trivialGraph.nodes.push(player);

var vaccinatedBayStartYCoord = 125;

var start = false;

var nextX = 800;
var nextY = 140;

var guideXCoord = 400;
var guideYCoord = 70;
var guide2YCoordChange = 35;

var colorScale;
var figMargin;
var figWidth;
var figHeight;
var figX;
var figY;
var figLines;
var svgTutorial;
var xLab;
var yLab;
var nonInterventionLegend;
var interventionLegend;
var nonInterventionLab;
var interventionLab;
var tutorialSeries;

var width = 960,
    height = 450,
    svg;

var guideTextSVG;

var menuBoxSVG;

var actionBay;

var lessonText;

var force, link, node;

guideTextSVG = d3.select("body").append("svg")
    .attr("class", "guideTextSVG")

menuBoxSVG = d3.select("body").append("svg")
    .attr("class", "menuBoxSVG")

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg")
    .attr("pointer-events", "all")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('svg:g');

guide = d3.select(".guideTextSVG").append("text")
    .attr("class", "guide")
    .attr("x",guideXCoord).attr("y",guideYCoord)
    .attr("font-size", 28)
    .style("font-family", "Nunito")
    .style("fill", "#707070")
    .style("font-weight", 300)
    .text("")

lessonText = d3.select(".svg").append("text")
    .attr("class", "lessonText")
    .attr("x", 35)
    .attr("y", 30)
    .style("font-size", 28)
    .style("font-family", "Nunito")
    .style("fill", "#707070")
    .style("font-weight", 700)
    .attr("opacity", 0)
    .text("LESSON 1: NETWORKS")

guide2 = d3.select(".guideTextSVG").append("text")
    .attr("class", "guide2")
    .attr("x",guideXCoord).attr("y",guideYCoord+guide2YCoordChange)
    .attr("font-size", 28)
    .style("font-family", "Nunito")
    .style("fill", "#707070")
    .style("font-weight", 300)
    .text("")

var startText = d3.select(".guideTextSVG").append("text")
    .attr("class", "startText")
    .attr("x", 363)
    .attr("y", 100)
    .text("Click to Begin")
    .attr("font-size", 36)
    .style("font-family", "Nunito")
    .style("fill", "#707070")
    .style("font-weight", 300)
    .on("click", function() {
        d3.select(this).attr("opacity", 0).attr("x", -50)
        advanceTutorial();
    });

var backArrow = d3.select(".guideTextSVG").append("text")
    .attr("class", "backArrow")
    .attr("x", 115)
    .attr("y", nextY)
    .style("font-family", "Nunito")
    .style("fill", "#707070")
    .attr("opacity", 0)
    .style("font-weight", 300)
    .attr("font-size", 15)
    .text('< back')
    .on("click", function() {
        guideRailsPosition--;
        guideRailsReverse();
    })

var timestepText = d3.select(".svg").append("text")
    .attr("class", "timestepText")
    .style("font-size", 30)
    .style("font-family", "Nunito")
    .style("font-weight", 700)
    .style("fill", "#707070")
    .attr("x",35).attr("y",90)
    .text("");

var timestepTicker = d3.select(".svg").append("text")
    .attr("class", "timestepTicker")
    .style("font-size", 45)
    .style("font-family", "Nunito")
    .style("font-weight", 700)
    .style("fill", "#707070")
    .attr("x",102).attr("y",91)
    .text("");

function guideRailsReverse() {

    if (guideRailsPosition == 0) {
        trivialGraph.nodes = [];
        trivialGraph.links = [];
        trivialGraph.nodes.push(tailoredNodes[0]);
        stepWiseUpdate();

    }

    if (guideRailsPosition == 1) {

        trivialGraph.nodes = [];
        trivialGraph.links = [];
        trivialGraph.nodes.push(tailoredNodes[0])
        trivialGraph.nodes.push(tailoredNodes[1])


        for (var i = 0; i < tailoredLinks.length; i++) {
            var link = tailoredLinks[i];
            if (link.source.id == tailoredNodes[0].id && link.target.id == tailoredNodes[1].id ||
                link.source.id == tailoredNodes[1].id && link.target.id == tailoredNodes[0].id) {

                    trivialGraph.links.push(link);
            }
        }

        stepWiseUpdate();

    }

    if (guideRailsPosition == 2) {
        trivialGraph.nodes = [];
        trivialGraph.links = [];

        trivialGraph.nodes.push(tailoredNodes[0]);
        trivialGraph.nodes.push(tailoredNodes[1]);
        trivialGraph.nodes.push(tailoredNodes[4]);
        trivialGraph.nodes.push(tailoredNodes[5]);
        trivialGraph.nodes.push(tailoredNodes[12]);

        for (var ii = 0; ii < trivialGraph.nodes.length; ii++) {
            for (var iii = 0; iii < trivialGraph.nodes.length; iii++) {
                if (edgeExists(trivialGraph.nodes[ii], trivialGraph.nodes[iii], tailoredGraph)) {
                    var linkString = {source:trivialGraph.nodes[ii],target:trivialGraph.nodes[iii],remove:false};
                    if (testDuplicate(trivialGraph.links, linkString)) continue;
                    trivialGraph.links.push(linkString);
                }
            }
        }

        stepWiseUpdate();
    }

    if (guideRailsPosition == 3 || guideRailsPosition == 4 || guideRailsPosition == 5) {
        if (guideRailsPosition == 3 || guideRailsPosition == 4) {
            d3.select(".backArrow").text("< Restart Outbreak")
        }

        //return to pre-outbreak from post-outbreak

        d3.select(".timestepText").text("")
        d3.select(".timestepTicker").text("")

        graph.nodes = [];
        graph.links = [];
        timestep = 0;
        diseaseIsSpreading = false;
        timeToStop = false;


        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S";
            tailoredNodes[i].infectedBy = null;
            tailoredNodes[i].exposureTimestep = null;
            graph.nodes.push(tailoredNodes[i]);

        }

        for (var ii = 0; ii < tailoredLinks.length; ii++) {
            graph.links.push(tailoredLinks[ii]);
        }
        tutorialUpdate();

    }

    if (guideRailsPosition == 6) {
        graph.links = [];
        graph.nodes.push(tailoredNodes[2]);
        graph.nodes[5].status = "V";


        // add only the links that are connected to the highest degree node
        for (var i = 0; i < tailoredLinks.length; i++) {
            var link = tailoredLinks[i];
            if (link.source.id == tailoredNodes[2].id || link.target.id == tailoredNodes[2].id) {
                graph.links.push(link);
            }
        }
        tutorialUpdate();
        d3.selectAll(".node")
            .transition()
            .duration(500)
            .attr("r", function(d) {
                if (d.status == "S") return 8;
                if (d.status == "V") return 15;
            })
            .style("fill", function(d) {
                if (d.status == "S") return "#b7b7b7";
                if (d.status == "V") return "#d9d678";
            })



    }

    if (guideRailsPosition == 9 || guideRailsPosition == 10 || guideRailsPosition == 11) {
        guideRailsPosition = 9;
        vaccineSupply = 3;
        vax = 3;

        d3.selectAll(".fixedVaxNode").remove();
        vaccinatedBayStartYCoord = 125;

        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S";
            tailoredNodes[i].fixed = false;
            graph.nodes.push(tailoredNodes[i]);
        }

        for (var ii = 0; ii < tailoredLinks.length; ii++)  {
            graph.links.push(tailoredLinks[ii]);
        }

        tutorialUpdate();
    }

    var back = true;
    guideRails(back);






}


var nextArrow = d3.select(".guideTextSVG").append("text")
    .attr("class", "nextArrow")
    .attr("x", nextX)
    .attr("y", nextY)
    .style("font-family", "Nunito")
    .style("fill", "#707070")
    .attr("opacity", 0)
    .style("font-weight", 300)
    .attr("font-size", 15)
    .text("next >")
    .on("click", function() {
        guideRailsPosition++;
        guideRails();
    })

var vaxShadow = d3.select(".menuBoxSVG").append("rect")
    .attr("class", "vaxShadow")
    .attr("x", 0)
    .attr("y", 27)
    .attr("width", 125)
    .attr("height", 75)
    .style("fill", "#838383")

var vaxBox = d3.select(".menuBoxSVG").append("rect")
    .attr("class", "vaxBox")
    .attr("x", 0)
    .attr("y", 20)
    .attr("width", 120)
    .attr("height", 75)
    .style("fill", "#85bc99")

var vaxText = d3.select(".menuBoxSVG").append("text")
    .attr("class", "vaxText")
    .attr("x", 23)
    .attr("y", 70)
    .style("font-size", 28)
    .style("font-family", "Nunito")
    .style("font-weight", 400)
    .style("fill", "white")
    .text("VAX!")

var menuShadow = d3.select(".menuBoxSVG").append("rect")
    .attr("class", "menuShadow")
    .attr("x", 200)
    .attr("y", 27)
    .attr("width", 800)
    .attr("height", 75)
    .style("fill", "#838383")

var menuBox = d3.select(".menuBoxSVG").append("rect")
    .attr("class", "menuBox")
    .attr("x", 195)
    .attr("y", 20)
    .attr("width", 800)
    .attr("height", 75)
    .style("fill", "#85bc99")


var menuHeaderLeft = d3.select(".menuBoxSVG").append("text")
    .attr("class", "menuHeaderLeft")
    .attr("x", 210)
    .attr("y", 40)
    .style("font-size", 10)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("LESSONS")

var menuHeaderRight = d3.select(".menuBoxSVG").append("text")
    .attr("class", "menuHeaderRight")
    .attr("x", 750)
    .attr("y", 40)
    .style("font-size", 10)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("GAMING")

var moduleOne = d3.select(".menuBoxSVG").append("text")
    .attr("class", "moduleOne")
    .attr("x", 235)
    .attr("y", 68)
    .style("font-size", 15)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("Epidemics")

var moduleTwo = d3.select(".menuBoxSVG").append("text")
    .attr("class", "moduleTwo")
    .attr("x", 360)
    .attr("y", 68)
    .style("font-size", 15)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("Vaccines")

var moduleThree = d3.select(".menuBoxSVG").append("text")
    .attr("class", "moduleThree")
    .attr("x", 485)
    .attr("y", 68)
    .style("font-size", 15)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("Networks")


var moduleFour = d3.select(".menuBoxSVG").append("text")
    .attr("class", "moduleFour")
    .attr("x", 610)
    .attr("y", 68)
    .style("font-size", 15)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("Herd Immunity")

var gameModule = d3.select(".menuBoxSVG").append("text")
    .attr("class", "gameModule")
    .attr("x", 765)
    .attr("y", 68)
    .style("font-size", 15)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("Play the Full Game")

var navShadow = d3.select(".menuBoxSVG").append("rect")
    .attr("class", "navShadow")
    .attr("x", 753)
    .attr("y", 119)
    .attr("width", 220)
    .attr("height", 30)
    .style("fill", "#838383")

var navBox = d3.select(".menuBoxSVG").append("rect")
    .attr("class", "navBox")
    .attr("x", 750)
    .attr("y", 115)
    .attr("width", 220)
    .attr("height", 30)
    .style("fill", "#85bc99")

var groupText = d3.select(".menuBoxSVG").append("text")
    .attr("class", "groupText")
    .attr("x", 765)
    .attr("y", 135)
    .style("font-size", 14)
    .style("font-weight", 300)
    .style("font-family", "Nunito")
    .style("font-weight", 300)
    .style("fill", "white")
    .text("Salathé Group @ Penn State")

function advanceTutorial() {
    if (start) {
        guideRails();
    }
    else {
        start = true;
        initTutorial()
    };
}


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



function tutorialUpdate() {
    if (guideRailsPosition == 3) {
        d3.selectAll(".node").transition().duration(300).attr("r", 8)
    }

    var nodes = removeVaccinatedNodes(graph);
    var links = removeOldLinks(graph);

    graph.links = links;

    updateCommunities();

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
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";
            if (d.id == player.id && d.status != "I" && guideRailsPosition<6) color = "#2fa0ef";


            return color;});

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";
            if (d.id == player.id && d.status != "I" && guideRailsPosition<6) color = "#2fa0ef";


            return color;

        })
        .on("click", function(d) {
            if (vaccinateMode) {
                if (vaccineSupply <= 0) {
                    window.alert("Out of Vaccines!")
                    return;
                }
                d.status = "V";
                d.fixed = true;
                d3.select(this)
                    .attr("class", "vaxNode")
                    .style("fill", "#d9d678")
                vaccinatedBayStartYCoord += 25;
                vaccineSupply--;
                numberVaccinated++;

                if (vaccineSupply == vax - 1) {
                    guideRailsPosition++;
                    guideRails();
                }

                if (vaccineSupply == 0 && intervention) {
                    guideRailsPosition++;
                    guideRails();
                }

                tutorialUpdate();
            }
        })
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    d3.select(".vaccineCounterText")
        .text(vaccineSupply + " / " + vax);


    d3.select(".vaxNode")
        .transition()
        .duration(500)
        .attr("cx", 93)
        .attr("cy", vaccinatedBayStartYCoord)
        .attr("class", "fixedVaxNode")

}

function addOneFriend() {

    trivialGraph.nodes.push(graph.nodes[1]);
    trivialGraph.links.push({source:trivialGraph.nodes[0],target:trivialGraph.nodes[1],remove:false})

    stepWiseUpdate();

}

function centerElement(element, classString) {
    console.log(element + "\t" + classString)

    var leftSide = element.node().getBBox().x;
    var width = element.node().getBBox().width;
    var rightSide = leftSide + width;

    var leftDistance = leftSide - 0;
    var rightDistance = 960 - rightSide;
    var delta = leftDistance - rightDistance;

    if (delta > 0) {
        var halfDelta = Math.round(0.5 * delta);

        var newLeftSide = leftSide - halfDelta;

        var selection = "." + classString;
        d3.select(selection).attr("x", newLeftSide);
    }

    if (delta < 0) {
        var halfDelta = Math.round(0.5 * delta);

        var newLeftSide = leftSide + halfDelta;

        var selection = "." + classString;
        d3.select(selection).attr("x", newLeftSide);
    }

}

function buildGraph() {
    //remove friend, it will be added again below
    trivialGraph.nodes.splice(1,1);
    trivialGraph.links = [];

    console.log(trivialGraph)

    tutorial = true;

    // add player neighbors
    for (var i = 0; i < graph.nodes.length; i++) {

        if (edgeExists(graph.nodes[i], trivialGraph.nodes[0], graph)) {
            trivialGraph.nodes.push(graph.nodes[i]);
        }
    }

    // add relevant links
    for (var ii = 0; ii < trivialGraph.nodes.length; ii++) {
        for (var iii = 0; iii < trivialGraph.nodes.length; iii++) {
            if (edgeExists(trivialGraph.nodes[ii], trivialGraph.nodes[iii], graph)) {
                var linkString = {source:trivialGraph.nodes[ii],target:trivialGraph.nodes[iii],remove:false};
                if (testDuplicate(trivialGraph.links, linkString)) continue;
                trivialGraph.links.push(linkString);
            }
        }
    }

    stepWiseUpdate();
}


function stepWiseUpdate() {

    var links = trivialGraph.links;
    var nodes = trivialGraph.nodes;

    updateCommunities();

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
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";
            if (d.id == player.id && d.status != "I") color = "#2fa0ef";
            return color;})
            .on("click", function(d) {
                if (vaccinateMode) {
                    if (vaccineSupply <= 0) {
                        window.alert("Out of Vaccines!")
                        return;
                    }
                    d.status = "V";
                    d3.select(this)
                        .attr("class", "vaxNode")
                        .style("stroke", "#636363")
                        .style("stroke-width", 2)
                        .style("fill", "#d9d678")

                    vaccinatedBayStartYCoord += 25;
                    vaccineSupply--;
                    numberVaccinated++;

                    if (vaccineSupply == (vax - 1)) {
                        guideRailsPosition++;
                        guideRails();
                    }

                    if (vaccineSupply == 0 && intervention) {
                        guideRailsPosition++;
                        guideRails();
                    }

                    tutorialUpdate();
                }});

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";

            if (d.id == player.id && d.status != "I") color = "#2fa0ef";

            return color;

        })
        .call(force.drag)
        .on("click", function(d) {
            if (vaccinateMode) {
                if (vaccineSupply <= 0) {
                    window.alert("Out of Vaccines!")
                    return;
                }
                d.status = "V";
                d3.select(this)
                    .attr("class", "vaxNode")
                    .style("stroke", "#636363")
                    .style("stroke-width", 2)
                    .style("fill", "#d9d678")

                vaccinatedBayStartYCoord += 25;
                vaccineSupply--;
                numberVaccinated++;

                if (vaccineSupply == vax - 1) {
                    guideRailsPosition++;
                    guideRails();
                }

                if (vaccineSupply == 0 && intervention) {
                    guideRailsPosition++;
                    guideRails();
                }

                tutorialUpdate();
            }});

    // Exit any old nodes.
    node.exit().remove();


}

function getPathogen_xyCoords(newInfections) {
    var xyCoords = [];
    var recentTransmitters = [];
    for (var i = 0; i < newInfections.length; i++) {
        recentTransmitters.push(newInfections[i].infectedBy);
        var coordString = {id: i, receiverX: newInfections[i].x, receiverY: newInfections[i].y, transmitterX: newInfections[i].infectedBy.x, transmitterY: newInfections[i].infectedBy.y}
        xyCoords.push(coordString);
    }
    return xyCoords;
}

function movePathogens() {
    d3.selectAll(".pathogen")
        .sort()
        .transition()
        .duration(600)
        .attr("cx", function(d) { return d.receiverX} )
        .attr("cy", function(d) { return d.receiverY} );


}


function createPathogens() {
    var pathogen = svg.selectAll(".pathogen")
        .data(xyCoords)
        .enter()
        .append("circle")
        .attr("class", "pathogen")
        .attr("cx", function(d) { return d.transmitterX })
        .attr("cy", function(d) { return d.transmitterY })
        .attr("r", 4)
        .style("fill", "green")

    // remove old pathogens, may not be useful here...
}

function removePathogens() {
    d3.selectAll(".pathogen")
        .transition()
        .duration(200)
        .style("opacity", 0)

    d3.selectAll(".node")
        .transition()
        .duration(200)
        .attr("r", 8)

    d3.selectAll(".pathogen").remove();
}


function toggleNodeFixation() {
    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].fixed = !graph.nodes[i].fixed;
    }
}


function tutorialTimesteps() {

    d3.select(".nextArrow").attr("opacity", 0).text("");
    d3.select(".backArrow").attr("opacity", 0).text("");

    // run exposure process & consider all potential state changes (recovery, in this case
    infection();
    stateChanges();

    // move all newly exposed individuals to the infected state, record individuals
    newInfections = [];
    newInfections = updateExposures();
    xyCoords = getPathogen_xyCoords(newInfections);

//
//    var I;
//    if (intervention) {
//        I = getStatuses("I");
//        intervention_series.push({group:"Intervention", time:timestep, value:I});
//        updateTutorialFig();
//    }
//    else {
//        I = getStatuses("I");
//        nonIntervention_series.push({group:"nonIntervention", time:timestep, value:I});
//        intervention_series.push({group:"Intervention", time:timestep, value:0});
//    }

    this.timestep++;


    d3.select(".timestepTicker")
        .text(timestep);


    detectCompletion();

    if (timeToStop == false) {
        animatePathogens_thenUpdate();
        window.setTimeout(tutorialTimesteps, 600);
    }

    if (timeToStop == true) {
        animatePathogens_thenUpdate();
        if (finalStop == true) {
            d3.select(".backArrow")
                .attr("opacity", 1)
                .text("< Start Over")
                .on("click", function() {
                    window.setTimeout(location.reload(), 1000);
                });
            return;
        }

        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("< Restart Outbreak")


        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")
    }
}

function animatePathogens_thenUpdate() {

    window.setTimeout(createPathogens, 0)

    window.setTimeout(movePathogens, 100)

    window.setTimeout(popNewInfection, 250)

    window.setTimeout(tutorialUpdate, 350)

    window.setTimeout(removePathogens, 400)

}

function popNewInfection() {
    d3.selectAll(".node")
        .transition()
        .duration(100)
        .attr("r", function(d) {
            var size = 8;
            if (d.status == "I") {
                if (timestep - d.exposureTimestep == 1) size = 12;
            }
            return size;
        })

}



function detectCompletion() {
    var numberOfInfecteds = 0;
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        if (node.status == "I") numberOfInfecteds++;
    }
    if (numberOfInfecteds == numberOfIndividuals) {
        timeToStop = true;
    }

    if (finalStop) {
        detectEndGame();
        if (endGame) {
            timeToStop = true;
        }
    }
}


function initTutorial() {
    d3.select(".lessonText")
        .attr("opacity", 1)

    // initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
    force = d3.layout.force()
        .nodes(trivialGraph.nodes)
        .links(trivialGraph.links)
        .size([width, height])
        .charge(charge)
        .on("tick", tick)
        .start();

// associate empty SVGs with link data. assign attributes.
    link = svg.selectAll(".link")
        .data(trivialGraph.links)
        .enter().append("line")
        .attr("class", "link");

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.
    node = svg.selectAll(".node")
        .data(trivialGraph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 15)
        .style("fill", "#2fa0ef")
        .call(force.drag)
        .on("click", function(d) {
            if (vaccinateMode) {
                if (vaccineSupply <= 0) {
                    window.alert("Out of Vaccines!")
                    return;
                }
                d.status = "V";
                d3.select(this)
                    .attr("class", "vaxNode")
                    .style("stroke", "#636363")
                    .style("stroke-width", 2)
                    .style("fill", "#d9d678")

                vaccinatedBayStartYCoord += 25;
                vaccineSupply--;
                numberVaccinated++;

                if (vaccineSupply == vax - 1) {
                    guideRailsPosition++;
                    guideRails();
                }

                if (vaccineSupply == 0 && intervention) {
                    guideRailsPosition++;
                    guideRails();
                }

                tutorialUpdate();
            }
        });



    d3.select(".guide")
        .attr("x",guideXCoord)
        .attr("y",guideYCoord)
        .attr("font-size", 28)
        .attr("opacity", 0)
        .text("Suppose this is you")

    centerElement(guide, "guide");

    d3.select(".guide")
        .transition()
        .duration(500)
        .attr("opacity", 1)

    d3.select(".nextArrow")
        .transition()
        .duration(500)
        .attr("opacity", 1)


}


function guideRails(back) {

    if (guideRailsPosition == 1) {
        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)


        d3.select(".lessonText")
            .transition()
            .duration(2000)
            .attr("opacity", 0)

        if (!back) addOneFriend();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("And this is you with one friend. The connection")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("represents contact between you two.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");


        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);



    }

    if (guideRailsPosition == 2) {


        if (!back) buildGraph();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now here are more friends who are connected to you and")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("to each other. This is your immediate contact group")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 3) {
        d3.select(".backArrow").text("< back")
        d3.select(".nextArrow").text("Next: Epidemics >")
        charge = -600;
        if (!back) tutorialUpdate();
        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Your friends have friends, who would be strangers to you,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("but together they make up your contact network")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 4) {
        d3.select(".lessonText").attr("opacity", 1)
            .text("LESSON 2: EPIDEMICS")

        d3.select(".nextArrow").text("next >")


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("But now, one of the strangers gets sick and the infection")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("starts to spread across the network...")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);



        var indexPatientID = Math.floor(Math.random() * numberOfIndividuals);
        graph.nodes[indexPatientID].status = "I";
        tutorialUpdate();
        diseaseIsSpreading=true;
        window.setTimeout(tutorialTimesteps, 2000);

        d3.select(".timestepText").text("Day: ")
        d3.select(".timestepTicker").text(timestep)

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text("")

        d3.select(".lessonText")
            .transition()
            .duration(3000)
            .attr("opacity", 0)
            .text("LESSON 2: EPIDEMICS")



    }

    if (guideRailsPosition == 5) {
        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("Next: Vaccines >")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("If no action is taken, then pretty soon")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("the entire network will be infected.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 6) {
        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text("next >")

        loadSyringe();
        vaccineSupply = 1;
        numberVaccinated = 0;

        d3.select(".backArrow").attr("opacity", 0).text("")

        d3.select(".timestepText")
            .transition()
            .duration(500)
            .attr("opacity", 0)

        d3.select(".timestepTicker")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text(timestep)

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("We can make it more difficult for diseases to spread")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("by cutting a network into smaller pieces.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        graph.nodes = [];
        graph.links = [];

        // reset all node attributes after outbreak simulation
        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S";
            tailoredNodes[i].infectedBy = null;
            tailoredNodes[i].exposureTimestep = null;
        }

        // add the highest degree node only, to illustrate single vaccination
        graph.nodes.push(tailoredNodes[2]);

        // add its neighbors
        graph.nodes.push(tailoredNodes[14-13])
        graph.nodes.push(tailoredNodes[16-13])
        graph.nodes.push(tailoredNodes[21-13])
        graph.nodes.push(tailoredNodes[22-13])
        graph.nodes.push(tailoredNodes[23-13])
        graph.nodes.push(tailoredNodes[24-13])
        graph.nodes.push(tailoredNodes[25-13])


        // add only the links that are connected to the highest degree node
        for (var i = 0; i < tailoredLinks.length; i++) {
            var link = tailoredLinks[i];
            if (link.source.id == tailoredNodes[2].id || link.target.id == tailoredNodes[2].id) {
                graph.links.push(link);
            }
        }
        tutorialUpdate();

        d3.selectAll(".node")
            .on("click", function(d) {
                if (d.id != 15) return;
                else {
                    d.status = "V";
                    d3.select(".vaccineCounterText").text(vaccineSupply + " / " + vax)


                    guideRailsPosition++;
                    numberVaccinated++;
                    guideRails();
                    window.setTimeout(tutorialUpdate, 2000);
                }
            })


    }

    if (guideRailsPosition == 7) {

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")

        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("< Instant Replay!")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("When we vaccinate a node,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("it is removed because it cannot be infected.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        tutorialUpdate();

        hideSyringe();
    }

    if (guideRailsPosition == 8) {
        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text("")


        d3.select(".lessonText")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("LESSON 3: VACCINES")

        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < tailoredNodes.length; i++) {
            graph.nodes.push(tailoredNodes[i]);
            graph.nodes[i].status = "S";
            graph.nodes[i].infectedBy = null;
            graph.nodes[i].exposureTimestep = null;
        }

        for (var ii = 0; ii < tailoredLinks.length; ii++) {
            graph.links.push(tailoredLinks[ii]);
        }

        d3.selectAll(".node")
            .on("click", function(d) {
                if (vaccinateMode) {
                    if (vaccineSupply <= 0) {
                        window.alert("Out of Vaccines!")
                        return;
                    }
                    d.status = "V";
                    d.fixed = true;
                    d3.select(this)
                        .attr("class", "vaxNode")
                        .style("fill", "#d9d678")
                    vaccinatedBayStartYCoord += 25;
                    vaccineSupply--;
                    numberVaccinated++;

                    if (vaccineSupply == 2) {
                        guideRailsPosition++;
                        guideRails();
                    }

                    if (vaccineSupply == 0 && intervention) {
                        guideRailsPosition++;
                        guideRails();
                    }

                    tutorialUpdate();
                }});


        tutorialUpdate();

        d3.select(".timestepText")
            .transition()
            .duration(500)
            .attr("opacity", 0)

        d3.select(".timestepTicker")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text(timestep)

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now let's look at the original network again, but this time")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("we'll use vaccines to break up the network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);




    }

    if (guideRailsPosition == 9) {
        vaccineSupply = 3;
        vax = 3;

        d3.select(".lessonText")
            .transition()
            .duration(1000)
            .attr("opacity", 0)
            .text("LESSON 3: VACCINES")

        loadSyringe();


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Select the 'Vaccinate' tool in the upper right and select")

        vaccineSupply = 3;
        intervention_series = [];
        diseaseIsSpreading = false;
        postInitialOutbreak = true;

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("nodes to vaccinate. You only get " + vaccineSupply + " vaccines, so choose wisely.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".nextArrow").attr("opacity", 0).text("")


    }

    if (guideRailsPosition == 10) {
        d3.select(".backArrow").attr("opacity", 1).text("< Clear Vaccinations")


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("When you vaccinate a node, they are effectively removed from")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("the network because they can no longer spread the infection.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 11) {
        d3.select(".backArrow").attr("opacity", 1).text("< Clear Vaccinations")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Vaccinating breaks the network into smaller pieces")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("making it less likely for an infection to spread to every node.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")


    }

    if (guideRailsPosition == 12) {


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now, when an infection spreads, it is more likely")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("to be confined to a smaller network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);




        var numberOfPeople = graph.nodes.length;

        do{
            var randomIndex = Math.floor(Math.random() * numberOfPeople);
            var indexCase = graph.nodes[randomIndex];
        }
        while (indexCase.status == "V");

        indexCase.status = "I";
        diseaseIsSpreading = true;
        timestep = 0;
        timeToStop = false;
        postInitialOutbreak = false;
        finalStop = true;

        d3.select(".timestepText")
            .transition()
            .duration(500)
            .attr("opacity", 1)

        d3.select(".timestepTicker")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text(timestep)

        tutorialTimesteps();

    }



}

function loadSyringe() {
    actionBay = d3.select(".svg").append("svg")
        .attr("class", "actionBay")

    var shadowX = 845;
    var contX = 841;

    d3.select(".actionBay").append("rect")
        .attr("class", "vaccineShadow")
        .attr("x", 1000)
        .attr("y", 26)
        .attr("width", 125)
        .attr("height", 75)
        .style("fill", "#838383")
        .on("click", activateVaccinationMode)

    d3.select(".actionBay").append("rect")
        .attr("class", "vaccineBox")
        .attr("x", 1000)
        .attr("y", 20)
        .attr("width", 125)
        .attr("height", 75)
        .style("fill", "#85bc99")
        .on("click", activateVaccinationMode)

    d3.select(".actionBay").append("rect")
        .attr("class", "vaccineDepressedState")
        .attr("x", 860)
        .attr("y", 20)
        .attr("width", 80)
        .attr("height", 75)
        .style("fill","#77a989")
        .attr("opacity", 0);

    var img = actionBay.selectAll("image").data([0]);
    img.enter()
        .append("image")
        .attr("xlink:href", "/assets/syringe.png")
        .attr("x", "853")
        .attr("y", "34")
        .attr("width", "85")
        .attr("height", "45")
        .attr("opacity", 0)
        .attr("class", "syringe")
        .on("click", activateVaccinationMode)

    d3.select(".actionBay").append("text")
        .attr("class", "vaccineToggleText")
        .attr("x", 875)
        .attr("y", 38)
        .attr("opacity", 0)
        .style("font-size", 10)
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text("VACCINES")
        .on("click", activateVaccinationMode)

    d3.select(".actionBay").append("text")
        .attr("class", "vaccineCounterText")
        .attr("x", 885)
        .attr("y", 85)
        .attr("opacity", 0)
        .style("font-size", 16)
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text(vaccineSupply + " / " + vax)
        .on("click", activateVaccinationMode)

    d3.select(".vaccineShadow")
        .transition()
        .duration(500)
        .attr("x", shadowX);

    d3.select(".vaccineBox")
        .transition()
        .duration(500)
        .attr("x", contX);

    d3.selectAll("image")
        .transition()
        .duration(1200).attr("opacity", 1)

    d3.select(".vaccineToggleText")
        .transition()
        .duration(1200)
        .attr("opacity", 1)

    d3.select(".vaccineCounterText")
        .transition()
        .duration(1200)
        .attr("opacity", 1)



}

function hideSyringe() {
    d3.select(".actionBay").remove();
}

function activateVaccinationMode() {
    vaccinateMode = true;
    intervention = true;
    vaccineResearched = true;
    d3.select(".vaccineCounterText")
        .text(vaccineSupply + " / " + vax);

    d3.select(".vaccineDepressedState").attr("opacity", 1)

}

