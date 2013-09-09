var rewire = 0.10;
var meanDegree = 3;
var diseaseIsSpreading = false;
var transmissionRate = .25;
var recoveryRate = 0;
var maxRecoveryTime = 1000;
var numberVaccinated = 0;
var timeToStop = false;
var guideRailsPosition = 0;
var postInitialOutbreak = false;
var finalStop = false;
var endGame = false;
var intervention = false;
var tutorial = false;
var charge = -800;
var newInfections = [];
var xyCoords = [];
var vax = 1;
var exposureEdges = [];
var currentFlash = 0;
var keepFlashing = true;
var xFlashCounter = 0;
var numberQuarantined = 0;
var vaccineSupply = 0;
var vaccineResearched = false;
var vaccinateMode = false;
var treatMode = false;
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
var simulation = true;
var opacityIndex = 0;
var vaccinatedBayStartYCoord = 125;
var start = false;
var nextX = 800;
var nextY = 140;
var guideXCoord = 400;
var guideYCoord = 70;
var guide2YCoordChange = 35;
var width = 960,
    height = 450,
    svg;
var guideTextSVG;
var actionBay;
var lessonText;
var force, link, node;

// this is the full graph, made by Ike
var tailoredGraph = {};
var tailoredNodes = getTailoredNodes();
var tailoredLinks = getTailoredLinks();

// this is the working graph
var graph = {};
graph.nodes = tailoredNodes;
graph.links = tailoredLinks;

// this is the graph that starts as trivial (one node, no edges) and is built to reflect tailoredGraph. At which point, we switch to working graph
trivialGraph = {};
trivialGraph.nodes = [];
trivialGraph.links = [];

var player = graph.nodes[0];
trivialGraph.nodes.push(player);
var numberOfIndividuals = tailoredNodes.length;

// this is the graph with a few weak ties between communities to illustrate segregation by vaccination
var weakTieNodes = getWeakTieNodes();
var weakTieLinks = getWeakTieLinks();

guideTextSVG = d3.select("body").append("svg")
    .attr("class", "guideTextSVG")

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg")
    .attr("pointer-events", "all")
//    .call(d3.behavior.zoom().on("zoom", redraw))
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
    var back = true;
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
        d3.select(".redX").remove();

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

        keepFlashing = true;

    }

    if (guideRailsPosition == 10 || guideRailsPosition == 11 || guideRailsPosition == 12) {
        guideRailsPosition = 10;
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

    if (guideRailsPosition == 7 || guideRailsPosition == 9) hideSyringe();

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

    d3.select(".vaccineCounterText").text("")

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
        .style("fill", "black")
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

    exposureEdges = [];

    d3.select(".nextArrow").attr("opacity", 0).text("");
    d3.select(".backArrow").attr("opacity", 0).text("");

    // run exposure process & consider all potential state changes (recovery, in this case
    infection();
    stateChanges();

    // move all newly exposed individuals to the infected state, record individuals
    newInfections = [];
    newInfections = updateExposures();
    xyCoords = getPathogen_xyCoords(newInfections);

    this.timestep++;


    d3.select(".timestepTicker")
        .text(timestep);


    detectCompletion();

    if (timeToStop == false) {
        animatePathogens_thenUpdate();
        window.setTimeout(tutorialTimesteps, 800);
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
    window.setTimeout(createPathogens, 100)
    window.setTimeout(movePathogens  , 150)
    window.setTimeout(popNewInfection, 400)
    window.setTimeout(tutorialUpdate , 500)
    window.setTimeout(removePathogens, 550)
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

function initMenus() {

}

function initTutorial() {
    d3.select("body").append("div")
        .attr("class", "vaxLogoDiv")
        .text("VAX!")

    d3.select("body").append("div")
        .attr("class", "menuBox")

    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "networkSxn")
        .text("Networks")

    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "epidemicSxn")
        .text("Epidemics")

    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "vaccineSxn")
        .text("Vaccines")

    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "quarantineSxn")
        .text("Quarantine")

    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "gameLink")
        .text("Play the Full Game!")

    d3.select(".menuBox").append("div")
        .attr("class", "lessonHead")
        .text("LESSONS")

    d3.select(".menuBox").append("div")
        .attr("class", "gameHead")
        .text("GAMING")

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

    d3.selectAll(".node").style("cursor", 'pointer');

    d3.select(".lessonText")
        .attr("opacity", 1)

    d3.select("#networkSxn").attr("class","menuItemBold")

    d3.select(".vaxLogoDiv")
        .style("visibility", "visible")

    d3.select(".menuBox")
        .style("visibility", "visible")


    d3.select(".vaxLogoDiv")
        .style("left", "-12px")

    d3.select(".menuBox")
        .style("right", "-200px")

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
        d3.selectAll(".node").style("cursor", 'pointer');


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

        d3.selectAll(".node").style("cursor", 'pointer');


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
        charge = -200;
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
        d3.selectAll(".node").style("cursor", 'pointer');

    }

    if (guideRailsPosition == 4) {
        d3.select(".lessonText").attr("opacity", 1)
            .text("LESSON 2: EPIDEMICS")

        d3.select("#networkSxn").attr("class","menuItemNormal")

        d3.select("#epidemicSxn").attr("class","menuItemBold")



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
        var img2 = svg.selectAll("image").data([0]);
        img2.enter()
            .append("image")
            .attr("xlink:href", "/assets/redX.svg")
            .transition()
            .duration(500)
            .attr("x", "280")
            .attr("y", "20")
            .attr("width", "450")
            .attr("height", "450")
            .attr("opacity", 0.6)
            .attr("class", "redX")

        flashRedX();

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")

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
        d3.select(".redX").remove();
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
            .text("Select the 'Vaccinate' tool in the upper right")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("then click the flashing node to vaccinate it.")

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
        flashNode();
    }

    if (guideRailsPosition == 7) {
        keepFlashing = false;
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
    }

    if (guideRailsPosition == 8) {
        d3.select(".backArrow").attr("opacity", 0).text("< back")
        d3.select(".nextArrow").attr("opacity", 0).text("next >")

        keepFlashing=true;
        loadSyringe();
        vaccineSupply = 1;
        numberVaccinated = 0;

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now let's separate this network into two groups")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("by vaccinating any of the flashing nodes.")

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

        for (var i = 0; i < weakTieNodes.length; i++) {
            graph.nodes.push(weakTieNodes[i]);
        }

        for (var ii = 0; ii < weakTieLinks.length; ii++) {
            graph.links.push(weakTieLinks[ii]);
        }

        // remove nodes w/o edges
        for (var iv = 0; iv < graph.nodes.length; iv++) {
            var counter = 0;
            var node = graph.nodes[iv];
            for (var iii = 0; iii < graph.links.length; iii++) {
                var link = graph.links[iii];
                if (link.source.id == node.id || link.target.id == node.id) counter++;
            }
            if (counter == 0) graph.nodes.splice(iv, 1);
        }
        tutorialUpdate();
        flashNodes();
    }

    if (guideRailsPosition == 9) {
        d3.selectAll(".node")
            .attr("r", 8)
            .style("fill", "#b7b7b7")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now if an outbreak were to occur,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("it would not spread to both groups.")

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
        d3.select(".nextArrow").attr("opacity", 1).text("Next: Vaccines >")
    }

    if (guideRailsPosition == 10) {
        hideSyringe();
        vaccinateMode = false;
        d3.select(".vaccineDepressedState").style("visibility", "hidden")

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

        d3.select("#epidemicSxn").attr("class","menuItemNormal")

        d3.select("#vaccineSxn").attr("class","menuItemBold")

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

        vaccinateMode = false;
    }

    if (guideRailsPosition == 11) {
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

    if (guideRailsPosition == 12) {
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

    if (guideRailsPosition == 12) {
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

    if (guideRailsPosition == 13) {
        hideSyringe();

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

function flashRedX() {
    if (xFlashCounter > 2) return;
    var opacities = [.15, 0.75];
    if (opacityIndex == 0) opacityIndex = 1;
    else { if (opacityIndex == 1) opacityIndex = 0;};
    d3.selectAll(".redX")
        .transition()
        .duration(750)
        .attr("opacity", opacities[opacityIndex]);
    xFlashCounter++;
    window.setTimeout(flashRedX, 750);
}

function loadSyringe() {
    if (quarantineMode) hideQuarantine();
    d3.select(".actionVax").style("visibility", "visible");
    d3.select(".actionVax").style("right", 0);

    d3.select(".vaccineCounterText").remove()

    d3.select(".actionVax").append("text")
        .attr("class", "vaccineCounterText")
        .style("font-size", 16)
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text("")

    d3.select(".vaccineCounterText").text(vaccineSupply + " / " + vax)
}

function hideSyringe() {
    vaccinationMode = false;
    d3.select(".actionVax").style("right", "-200px")
    d3.select(".svg").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".vaccineDepressedState").style("visibility", "hidden")
}

function loadQuarantine() {
    if (vaccinateMode) hideSyringe();

    quarantineMode = true;
    d3.select(".actionQuarantine").style("visibility", "visible");
    d3.select(".actionQuarantine").style("right", 0);

    d3.select(".quarantineCounterText").remove()

    d3.select(".actionQuarantine").append("text")
        .attr("class", "quarantineCounterText")
        .style("font-size", 16)
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text("")

    d3.select(".quarantineCounterText").text("x" + numberQuarantined) //TODO still needs a value
}

function hideQuarantine() {
    quarantineMode = false;
    d3.select(".actionQuarantine").style("right", "-200px")
    d3.select(".svg").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".quarantineDepressedState").style("visibility", "hidden")
}

function flashNode() {
    var node = graph.nodes[0];
    if (currentFlash == 0) currentFlash = 1;
    else {
        if (currentFlash == 1) currentFlash = 0;
    }
    var availableColors = ["#d9d678", "#b7b7b7"]

    d3.selectAll(".node")
        .transition()
        .duration(500)
        .style("fill", function(d) {
            if (d.id == node.id) return availableColors[currentFlash];
            else return availableColors[1];
        })
    d3.selectAll(".node")
        .on("click", function(d) {
            if (d.id == node.id) {
                if (vaccinateMode) {
                    d.status = "V";
                    vaccineSupply--;
                    numberVaccinated++;
                    keepFlashing = false;
                    guideRailsPosition++;
                    keepFlashing = false;
                    guideRails();
                    tutorialUpdate();
                }
            }
        });
    if (keepFlashing) window.setTimeout(flashNode, 500);
}

function flashNodes() {
    var nodeA = graph.nodes[3];
    var nodeB = graph.nodes[5];
    var nodeC = graph.nodes[9];
    if (currentFlash == 0) currentFlash = 1;
    else {
        if (currentFlash == 1) currentFlash = 0;
    }
    var availableColors = ["#d9d678", "#b7b7b7"]
    d3.selectAll(".node")
        .transition()
        .duration(500)
        .style("fill", function(d) {
            if (d.id == 10 || d.id == 4 || d.id == 6) return availableColors[currentFlash];
            else return availableColors[1];
        })

    d3.selectAll(".node")
        .on("click", function(d) {
            if (d.id == 10 || d.id == 4 || d.id == 6) {
                if (vaccinateMode) {
                    d.status = "V";
                    vaccineSupply--;
                    numberVaccinated++;
                    keepFlashing = false;
                    guideRailsPosition++;
                    keepFlashing = false;
                    guideRails();
                    tutorialUpdate();
                }
            }
        });
    if (keepFlashing) window.setTimeout(flashNodes, 500);
}

function activateVaccinationMode() {
    vaccinateMode = true;
    d3.selectAll(".node").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".svg").style("cursor", 'url(/assets/vax_cursor.cur)');
    intervention = true;
    vaccineResearched = true;
    d3.select(".vaccineCounterText")
        .text(vaccineSupply + " / " + vax);
    d3.select(".vaccineDepressedState").style("visibility", "visible")
}
