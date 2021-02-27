// game constants
var difficulty;
var scenarioTitle;
var numberOfIndividuals;
var numberOfRefusers;
var numberOfVaccines;
var independentOutbreaks;
var transmissionRate;
var recoveryRate;
var currentGameCookie;
var graph;
var speed;
var xyCoords;
var rewire = 0.1;
var meanDegree;
var resizingParameter = 1.9;
var invisibleParameter = 1.5;

// game phase markers
var vaccinateMode;
var quarantineMode;
var numberVaccinated;
var numberQuarantined;
var gameIsOver;
var timeToStop;
var diseaseIsSpreading;

// node pinning variables
var currentNode;
var currentElement;

// audio
var pop;

// d3 selections as variables
var scenarioSVG;
var link;
var node;
var clickArea;

// d3 constants
var width = 900;
var height = 700 - 45 - 50;  // standard height - footer:height - footer:bottomMargin
var charge = -500;
var friction = 0.9;

// d3 force directed
var force;

// cookies
var unlocks;

// fine tuning the drag versus click differentiation
var originalLocation = [0,0];
var newLocation = [0,0];
var dragStartDateObject;
var dragStartMillis;
var dragEndDateObject;
var dragEndMillis;
var clickTime;
var dragDistanceThreshold = 10;
var clickTimeThreshold = 150;

var timestep = 0;
var toggleDegree = true;
var game = false;

runScenario();

d3.select(".scenarioSVG").append("text").attr("x", 350).attr("y", 50).text("UNDER CONSTRUCTION...")

function runScenario() {
    setCurrentGameConditions();
    initScenarioGraph(scenarioTitle);
    drawScenarioSpace();
    window.setTimeout(function() {
        loadSyringeIcon()
        pop = document.getElementById('audio');
    }, 1)
}


function setCurrentGameConditions() {
    // revert back to /scenario page if cookie is empty
    $.cookie.json = true;
    var cookies = $.cookie('vaxCurrentGame')
    if (cookies == undefined) window.location.href = '/scenario'
    else currentGameCookie = $.cookie('vaxCurrentGame')

    scenarioTitle = currentGameCookie.scenario;
    difficulty = currentGameCookie.difficulty;
    numberOfRefusers = currentGameCookie.refusers;
    numberOfVaccines = currentGameCookie.vax;
    independentOutbreaks = currentGameCookie.outbreaks;
    transmissionRate = currentGameCookie.transmissionRate;
    recoveryRate = currentGameCookie.recoveryRate;
    speed = currentGameCookie.speedMode;
}


function initScenarioGraph(scenarioTitle) {
    friction = 0.83;

    if (scenarioTitle == "Workplace / School") {
        friction = 0.15;
        charge = -7500;
        toggleDegree = false;
        graph = initHuckNet();
    }
    if (scenarioTitle == "Movie Theater / Lecture Hall") {
        graph = initTheaterNet();
        invisibleParameter = 1.5;
        resizingParameter = 1.7;
        charge = -600;

    }
    if (scenarioTitle == "Restaurant") {
        charge = -450;
        graph = initRestaurantNet();
        invisibleParameter = 1.2;
        resizingParameter = 1.3
    }
    if (scenarioTitle == "Organization") {
        invisibleParameter = 1.5;
        resizingParameter = 1.9;
        charge = -600;
        graph = initClubNet();
    }
    if (scenarioTitle == "Endless Queue") {
        graph = initShopNet();
        invisibleParameter = 1.3;
        resizingParameter = 1.4;
        charge = -190;
    }
    if (scenarioTitle == "Random Networks") {
        graph = initRandomNet();

        if (difficulty == "easy") {
            invisibleParameter = 1.7;
            resizingParameter = 1.9;
            charge = -750;
        }
        if (difficulty == "medium") {
            invisibleParameter = 1.7;
            resizingParameter = 1.8;
            charge = -600;
        }
        if (difficulty == "hard") {
            invisibleParameter = 1.7;
            resizingParameter = 1.7;
            charge = -400;
        }
    }

    if (numberOfRefusers > 0) createRefusers();

    numberOfIndividuals = graph.nodes.length;

}

function createRefusers() {
    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].refuser = false;
    }
    var refuserCount = 0;
    while (refuserCount < numberOfRefusers) {
        var randomRefuser = graph.nodes[Math.floor(Math.random()*graph.nodes.length)];
        randomRefuser.refuser = true;
        refuserCount++;
    }
}

function drawScenarioSpace() {
    initFooter();
    window.setTimeout(function() {d3.select(".gameMenuBox").style("right", "-10px"); d3.select(".gameVaxLogoDiv").style("left", "-12px")},1)
    d3.select("#newGameNav").on("click", function() {window.location.href = '/scenario'})


    vaccinateMode     = true  ;
    quarantineMode    = false ;
    numberVaccinated  = 0     ;
    numberQuarantined = 0     ;
    timeToStop        = false ;
    gameIsOver        = false ;

    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6

    if (isFirefox || isIE) {
        scenarioSVG = d3.select("body").append("svg")
            .attr({
                "width": 950,
                "height": 768 - 45
            })
            .attr("class", "scenarioSVG")
            .attr("pointer-events", "all")
            .append('svg:g');
    }
    else {
        scenarioSVG = d3.select("body").append("svg")
            .attr({
                "width": "100%",
                "height": "87.5%"  //footer takes ~12.5% of the page
            })
            .attr("viewBox", "0 0 " + width + " " + height )
            .attr("class", "scenarioSVG")
            .attr("pointer-events", "all")
            .append('svg:g');
    }

    // initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
    force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .size([width, height])
        .charge(charge)
        .friction(friction)
        .on("tick", tick)
        .start();

// associate empty SVGs with link data. assign attributes.
    link = scenarioSVG.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

// associate empty SVGs with node data. assign attributes.
    clickArea = scenarioSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "clickArea")
        .attr("fill", "black")
        .attr("r", function(node) {return invisibleParameter * nodeSizing(node)})
        .attr("opacity", 0)
        .on("click", function(node) {
            if (speed) speedModeClick(node);
            else turnModeClick(node);
        })
        .call(d3.behavior.drag()
            .on("dragstart", function(node) {
                dragStartDateObject = {};
                dragStartMillis = 0;
                dragEndMillis = 0;
                clickTime = 10000;


                dragStartDateObject = new Date();
                dragStartMillis = dragStartDateObject.getMilliseconds();
                originalLocation = [];
                newLocation = [];

                originalLocation[0] = node.x;
                originalLocation[1] = node.y;
                node.fixed = true;

            })
            .on("drag", function(node) {
                node.px += d3.event.dx;
                node.py += d3.event.dy;
                node.x += d3.event.dx;
                node.y += d3.event.dy;
                tick();

                newLocation[0] = node.x;
                newLocation[1] = node.y;

            })
            .on("dragend", function(node) {
                dragEndMillis = dragStartDateObject.getMilliseconds();
                clickTime = Math.abs(dragEndMillis - dragStartMillis);
                console.log(clickTime + "\t" + getCartesianDistance(originalLocation, newLocation))

                node.fixed = false;
                tick();
                force.resume();

                // ACCOUNT FOR MICRO-MOVEMENT DURING INTENDED CLICK
                // if dragDistance is very small
                if (getCartesianDistance(originalLocation, newLocation) < dragDistanceThreshold) {
                    // AND clickTime very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeClick(node);
                        else turnModeClick(node);
                    }
                }
                //ACCOUNT FOR LARGE-FAST MOVEMENT DURING INTENDED CLICK
                // however, if dragDistance is larger than the threshold
                else {
                    // but the clickTime is still very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeClick(node);
                        else turnModeClick(node);
                    }
                }


            })


        )



    node = scenarioSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", nodeSizing)
        .attr("fill", nodeColoring)
        .on("click", function(node) {
            if (speed) speedModeClick(node);
            else turnModeClick(node);
        })
        .call(d3.behavior.drag()
            .on("dragstart", function(node) {
                dragStartDateObject;
                dragStartMillis;
                dragEndDateObject;
                dragEndMillis;
                clickTime = 10000;
                originalLocation = [];
                newLocation = [];


                dragStartDateObject = new Date();
                dragStartMillis = dragStartDateObject.getMilliseconds();


                originalLocation[0] = node.x;
                originalLocation[1] = node.y;
                node.fixed = true;

            })
            .on("drag", function(node) {
                node.px += d3.event.dx;
                node.py += d3.event.dy;
                node.x += d3.event.dx;
                node.y += d3.event.dy;
                tick();

                newLocation[0] = node.x;
                newLocation[1] = node.y;

            })
            .on("dragend", function(node) {
                dragEndDateObject = new Date();
                dragEndMillis = dragEndDateObject.getMilliseconds();
                clickTime = Math.abs(dragEndMillis - dragStartMillis);
                console.log(clickTime + "\t" + getCartesianDistance(originalLocation, newLocation))

                node.fixed = false;
                tick();
                force.resume();

                // ACCOUNT FOR MICRO-MOVEMENT DURING INTENDED CLICK
                // if dragDistance is very small
                if (getCartesianDistance(originalLocation, newLocation) < dragDistanceThreshold) {
                    // AND clickTime very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeClick(node);
                        else turnModeClick(node);
                    }
                }
                //ACCOUNT FOR LARGE-FAST MOVEMENT DURING INTENDED CLICK
                // however, if dragDistance is larger than the threshold
                else {
                    // but the clickTime is still very fast
                    if (clickTime < clickTimeThreshold) {
                        // assume intended click
                        if (speed) speedModeClick(node);
                        else turnModeClick(node);
                    }
                }


            })
        )
        .on("mouseover", function(node) {
            d3.select(this).style("stroke-width","3px");
            currentNode = node;
            currentElement = d3.select(this);
        })
        .on("mouseout", function() {
            d3.select(this).style("stroke-width","2px")
            if (currentNode.fixed == true) d3.select(this).style("stroke-width","3px");
            currentNode = null;
            currentElement = null;
        })

    loadHotkeys();
    if (numberOfRefusers>0) refuserNotify();

}

function turnModeClick(node) {
    if (vaccinateMode) {
        if (node.refuser == true) return;
        try {
            pop.play()
        }
        catch(err){

        }
        node.status = "V";
        numberOfVaccines--;
        numberVaccinated++;
    }
    else {
        if (node.status == "S") {
            try {
                pop.play()
            }
            catch(err){

            }
            diseaseIsSpreading = true;
            node.status = "Q";
            numberQuarantined++;
            window.setTimeout(timesteps, 500);
        }
    }
    if (numberOfVaccines == 0 && !diseaseIsSpreading) loadQuarantinePhase();
    update();
}

function speedModeClick(node) {


    if (vaccinateMode) {
        if (node.refuser == true) return;

        try {
            pop.play()
        }
        catch(err){

        }
        node.status = "V";
        numberOfVaccines--;
        numberVaccinated++;
    }
    else {
        if (node.status == "S" || node.status == "REF") {
            if (!diseaseIsSpreading) timesteps();

            try {
                pop.play()
            }
            catch(err){

            }
            diseaseIsSpreading = true;
            node.status = "Q";
            numberQuarantined++;
        }
    }
    if (numberOfVaccines == 0 && !diseaseIsSpreading) loadQuarantinePhase();
    update();

}

function timesteps() {
    if (speed) rtTimesteps();
    else turnTimesteps();
}

function turnTimesteps() {
    infection_noGuaranteedTransmission();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectScenarioEndPoint();
    if (!timeToStop) {
        animateInfectionRound();
    }
    else {
        animateInfectionRound();
    }
}

function rtTimesteps() {
    infection_noGuaranteedTransmission();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    timestep++;
    detectScenarioEndPoint();
    if (!timeToStop) {
        animateInfectionRound();
        window.setTimeout(rtTimesteps, 1750)
    }
    else {
        animateInfectionRound();
    }
}

function createIndexPatients() {
    quarantineMode = true;
    diseaseIsSpreading = true;
    var indexPatientID = 0;
    var independentOutbreaksCounter = independentOutbreaks;
    while(independentOutbreaksCounter > 0) {
        do {
            indexPatientID = Math.floor(Math.random() * graph.nodes.length);
        }
        while (graph.nodes[indexPatientID].status != "S");

        graph.nodes[indexPatientID].status = "I";
        graph.nodes[indexPatientID].infectedBy = "indexPatient";
        graph.nodes[indexPatientID].exposureTimestep = 0;
        independentOutbreaksCounter--;

    }
    outbreakNotify();
    update();

}

function update() {
    d3.select(".vaccineCounterText").text(numberOfVaccines)
    d3.select(".quarantineCounterText").text("x" + numberQuarantined)
    var nodes = removeVaccinatedNodes(graph);
    var links = removeOldLinks(graph);
    graph.links = links;
    updateCommunities();

    force
        .nodes(nodes)
        .charge(charge)
        .friction(friction)
        .links(links)
        .start();

    link = scenarioSVG.selectAll("line.link")
        .data(links, function(link) { return link.source.id + "-" + link.target.id;});

    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(link) { return link.source.x; })
        .attr("y1", function(link) { return link.source.y; })
        .attr("x2", function(link) { return link.target.x; })
        .attr("y2", function(link) { return link.target.y; });

    // Exit any old links.
    link.exit().remove();

    // Update the nodes…
    node = scenarioSVG.selectAll("circle.node")
        .data(nodes, function(node) { return node.id })
        .style("fill", nodeColoring)

    d3.selectAll(".node")
        .transition()
        .duration(100)
        .attr("r", nodeSizing)

    d3.selectAll(".clickArea")
        .on("click", function(node) {
            if (node.status == "V" || node.status == "Q") return;
            else {
                if (speed) speedModeClick(node);
                else turnModeClick(node);
            }
        })
        .attr("r", function(node) {return invisibleParameter * nodeSizing(node)})

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill", nodeColoring)
        .on("click", function(node) {
            if (speed) speedModeClick(node)
            else turnModeClick(node);
        })

    // Exit any old nodes.
    node.exit().remove();
}

function loadSyringeIcon() {
    vaccinateMode = true;
    d3.select(".actionVax").style("visibility", "visible");
    d3.select(".actionVax").style("right", 0);

    d3.select("#vaxShieldText").style("color", "white")

    d3.select(".actionVax").append("text")
        .attr("class", "vaccineCounterText")
        .style("font-size", "16px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("color", "white")
        .text("")
        .style("right", function() {
            if (numberOfVaccines.toString().length == 1) return "49px"
            if (numberOfVaccines.toString().length == 2) return "46px"

        })

    d3.select(".vaccineCounterText").text(numberOfVaccines)

    window.setTimeout(activateVaxPhase, 100)

}


function tick() {
    clickArea.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 8, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min((height *.85), d.y)); });

    node.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 8, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min((height *.85), d.y)); });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

}

function nodeSizing(node) {
    var size = 8;
    if (toggleDegree) size = (findNeighbors(node).length + 1.5) * resizingParameter;
    return size;
}

function nodeColoring(node) {
    var color = null;
    if (node.status == "S") color = "#b7b7b7";
    if (node.status == "E") color = "#ef5555";
    if (node.status == "I") color = "#ef5555";
    if (node.status == "R") color = "#9400D3";
    if (node.status == "V") color = "#76A788";
    if (node.status == "Q") color = "#d9d678";

    if (node.status == "S" && node.refuser) {
        color = "#fab45a"
    }

    return color;
}



function animateInfectionRound() {
    if (gameIsOver) return;
    window.setTimeout(generatePathogen    , 50)
    window.setTimeout(animatePathogen     , 100)
    window.setTimeout(animateNewInfection , 300)
    window.setTimeout(destroyPathogen     , 800)
    window.setTimeout(update              , 850)
    if (timeToStop && !diseaseIsSpreading) endScenario();
}

function animateNewInfection() {
    d3.selectAll(".node")
        .transition()
        .duration(500)
        .attr("r", function(node) {
            var currentSize;
            if (toggleDegree) {
                currentSize = (findNeighbors(node).length + 1.5) * resizingParameter;
            }
            else currentSize = 8;
            if (node.status == "I") {
                if (timestep - node.exposureTimestep == 1) return currentSize * 1.5;
                else return currentSize;
            }
            else return currentSize;
        })
}

function animatePathogen() {
    d3.selectAll(".pathogen")
        .sort()
        .transition()
        .duration(600)
        .attr("cx", function(node) { return node.receiverX} )
        .attr("cy", function(node) { return node.receiverY} );
}

function generatePathogen() {
    xyCoords = getPathogen_xyCoords(newInfections);

    var pathogen = scenarioSVG.selectAll(".pathogen")
        .data(xyCoords)
        .enter()
        .append("circle")
        .attr("class", "pathogen")
        .attr("cx", function(node) { return node.transmitterX })
        .attr("cy", function(node) { return node.transmitterY })
        .attr("r", 4)
        .style("fill", "black")
}

function destroyPathogen() {
    d3.selectAll(".node")
        .transition()
        .duration(200)
        .attr("r", 8)

    d3.selectAll(".pathogen")
        .transition()
        .duration(200)
        .style("opacity", 0)

    d3.selectAll(".pathogen").remove();
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

function refuserNotify() {
    d3.select(".scenarioSVG").append("rect")
        .attr("class", "refuserNotifyShadow")
        .attr("x", window.innerWidth/4 - 114)
        .attr("y", -100)
        .attr("width", 325)
        .attr("height", 50)
        .attr("fill", "#838383")
        .attr("opacity", 1)

    d3.select(".scenarioSVG").append("rect")
        .attr("class", "refuserNotifyBox")
        .attr("x", window.innerWidth/4 - 120)
        .attr("y", -100)
        .attr("width", 325)
        .attr("height", 50)
        .attr("fill", "#85bc99")
        .attr("opacity", 1)

    d3.select(".scenarioSVG").append("text")
        .attr("class", "refuserNotifyText")
        .attr("x", window.innerWidth/4 - 90)
        .attr("y", -100)
        .attr("fill", "white")
        .style("font-family", "Nunito")
        .style("font-size", "24px")
        .style("font-weight", 300)
        .text("Vaccine refusers present!")
        .attr("opacity", 1)

    d3.select(".refuserNotifyText").transition().duration(500).attr("y", 200 + 32)
    d3.select(".refuserNotifyBox").transition().duration(500).attr("y", 200)
    d3.select(".refuserNotifyShadow").transition().duration(500).attr("y", 200 + 7)

    window.setTimeout(function() {
        d3.select(".refuserNotifyShadow")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".refuserNotifyBox")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".refuserNotifyText")
            .transition()
            .duration(500)
            .attr("y", -100)


    }, 2500)
}

function outbreakNotify() {
    d3.select(".scenarioSVG").append("rect")
        .attr("class", "outbreakNotifyShadow")
        .attr("x", window.innerWidth/4 - 110)
        .attr("y", -100)
        .attr("width", 250)
        .attr("height", 50)
        .attr("fill", "#838383")
        .attr("opacity", 1)

    d3.select(".scenarioSVG").append("rect")
        .attr("class", "outbreakNotifyBox")
        .attr("x", window.innerWidth/4 - 115)
        .attr("y", -100)
        .attr("width", 250)
        .attr("height", 50)
        .attr("fill", "#85bc99")
        .attr("opacity", 1)

    d3.select(".scenarioSVG").append("text")
        .attr("class", "outbreakNotifyText")
        .attr("x", window.innerWidth/4 - 95)
        .attr("y", -100)
        .attr("fill", "white")
        .style("font-family", "Nunito")
        .style("font-size", "24px")
        .style("font-weight", 300)
        .text("Outbreak Detected!")
        .attr("opacity", 1)

    d3.select(".outbreakNotifyText").transition().duration(500).attr("y", window.innerHeight/2 - 300 + 100 - 70 + 5)
    d3.select(".outbreakNotifyBox").transition().duration(500).attr("y", window.innerHeight/2 - 300)
    d3.select(".outbreakNotifyShadow").transition().duration(500).attr("y", window.innerHeight/2 - 300 + 7)

    window.setTimeout(function() {
        d3.select(".outbreakNotifyShadow")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".outbreakNotifyBox")
            .transition()
            .duration(500)
            .attr("y", -100)

        d3.select(".outbreakNotifyText")
            .transition()
            .duration(500)
            .attr("y", -100)


    }, 2000)

}



function hideSyringeIcon() {
    vaccinationMode = false;
    d3.select(".actionVax").style("right", "-200px")
    d3.select(".gameSVG").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".vaccineDepressedState").style("visibility", "hidden")
}

function loadQuarantinePhase() {
    if (vaccinateMode) hideSyringeIcon();
    vaccinateMode = false;
    d3.select(".actionQuarantine").style("visibility", "visible");
    d3.select(".actionQuarantine").style("right", "0px");

    d3.select(".quarantineCounterText").remove()

    d3.select("#quarantineText").style("color", "white")

    d3.select(".actionQuarantine").append("text")
        .attr("class", "quarantineCounterText")
        .style("font-size", "16px")
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("color", "white")
        .text("")

    d3.select(".quarantineCounterText").text("x" + numberQuarantined)

    window.setTimeout(activateQuarantinePhase, 1000);
}

function hideQuarantineIcon() {
    quarantineMode = false;
    d3.select(".actionQuarantine").style("right", "-200px")
    d3.select(".gameSVG").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".quarantineDepressedState").style("visibility", "hidden")
}

function activateVaxPhase() {
    vaccinateMode = true;
    d3.selectAll(".node").style("cursor", 'url(/img/vax_cursor.cur)');
    d3.select(".gameSVG").style("cursor", 'url(/img/vax_cursor.cur)');
    d3.select(".vaccineCounterText").text(numberOfVaccines);
    d3.select(".vaccineDepressedState").style("visibility", "visible")

}

function activateQuarantinePhase() {
    vaccinateMode = false;
    quarantineMode = true;
    d3.selectAll(".node").style("cursor", 'url(/img/vax_cursor.cur)');
    d3.select(".gameSVG").style("cursor", 'url(/img/vax_cursor.cur)');
    d3.select(".quarantineDepressedState").style("visibility", "visible");


    // prevent accidental creation of new index patients after initial infections
    var counter = 0;
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == "I" || graph.nodes[i].status == "R") counter++;
    }
    if (counter == 0) createIndexPatients();

}



function loadHotkeys() {
    var visible = true;

    d3.select("body").append("div")
        .attr("id", "pinNodesDiv")

    d3.select("#pinNodesDiv").append("text")
        .attr("id", "pinHeader")
        .style("color", "#2692F2")
        .text("▴ Pin Nodes ▴")
        .style("cursor", "pointer")

    d3.select("#pinNodesDiv").append("text")
        .attr("id", "pinText")
        .html("Hover and hit <b>spacebar</b> to pin.")

    d3.select("#pinNodesDiv").append("text")
        .attr("id", "unPinText")
        .html("Hover and hit <b>shift+spacebar</b> </br> to unpin.")

    d3.select("#pinNodesDiv")
        .on("click", function() {
            if (!visible) {
                d3.select("#pinNodesDiv").append("text")
                    .attr("id", "pinText")
                    .html("Hover and hit <b>spacebar</b> to pin.")

                d3.select("#pinNodesDiv").append("text")
                    .attr("id", "unPinText")
                    .html("Hover and hit <b>shift+spacebar</b> </br> to unpin.")
            }
            else {
                d3.select("#pinText").remove();
                d3.select("#unPinText").remove();
            }
            visible = !visible;

            if (visible) d3.select("#pinHeader").text("▴ Pin Nodes ▴")
            else d3.select("#pinHeader").text("▾ Pin Nodes ▾")

        });
}

function detectScenarioEndPoint() {
    if (timeToStop || !diseaseIsSpreading) return

    updateCommunities();
    var numberOf_AtRisk_communities = 0;
    for (var groupIndex = 1; groupIndex < numberOfCommunities+1; groupIndex++) {
        var numberOfSusceptiblesPerGroup = 0;
        var numberOfInfectedPerGroup = 0;
        var numberOfRecoveredPerGroup = 0;

        for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
            var node = graph.nodes[nodeIndex];
            if (parseFloat(node.group) != groupIndex); //do nothing
            else {
                if (node.status == "S") numberOfSusceptiblesPerGroup++;
                if (node.status == "I") numberOfInfectedPerGroup++;
                if (node.status == "E") numberOfInfectedPerGroup++;
                if (node.status == "R") numberOfRecoveredPerGroup++;
            }
        }
        if (numberOfInfectedPerGroup > 0) {
            if (numberOfSusceptiblesPerGroup > 0) {
                numberOf_AtRisk_communities++;
            }
        }

    }

    if (numberOf_AtRisk_communities == 0 && diseaseIsSpreading) {
        diseaseIsSpreading = false;
        timeToStop = true;
        animateInfectionRound();
    }

}



function endScenario() {
    gameIsOver = true;
    console.log("end")
    $.removeCookie('vaxCurrentGame', { path: '/' });

    d3.select(".scenarioSVG").append("rect")
        .attr("class", "endGameShadow")
        .attr("x", window.innerWidth/4 + 5 - 150)
        .attr("y", -100)
        .attr("width", 500)
        .attr("height", 125)
        .attr("fill", "#838383")


    d3.select(".scenarioSVG").append("rect")
        .attr("class", "endGameBox")
        .attr("x", window.innerWidth/4 - 150)
        .attr("y", -100)
        .attr("width", 500)
        .attr("height", 125)
        .attr("fill", "#85bc99")

    d3.select(".scenarioSVG").append("text")
        .attr("class", "endGameText")
        .attr("x", window.innerWidth/4 - 75)
        .attr("y", -100)
        .style("font-family", "Nunito")
        .style("fill", "white")
        .style("font-weight", 500)
        .style("font-size", "25px")
        .text("Outbreak has run its course.")

    d3.select(".scenarioSVG").append("text")
        .attr("class", "endGameSUBMIT")
        .attr("x", window.innerWidth/4 + 75)
        .attr("y", -100)
        .style("font-family", "Nunito")
        .style("fill", "white")
        .style("font-weight", 500)
        .style("font-size", "15px")
        .style("cursor", "pointer")
        .text("Submit")
        .on("mouseover", function(d) {

            d3.select(this).style("fill", "#2692F2")

        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "white")
        })
        .on("click", function() {
            d3.select(".endGameText")
                .transition()
                .duration(250)
                .attr("x", window.innerWidth/4 - 25)
                .text("Reticulating splines.")

            window.setTimeout(addDot, 350)

            window.setTimeout(addDot2, 800)

            window.setTimeout(recordScores, 1200)

        })

    d3.select(".endGameBox").transition().duration(500).attr("y", window.innerHeight/2 - 300)
    d3.select(".endGameShadow").transition().duration(500).attr("y", window.innerHeight/2 - 300 + 7)
    d3.select(".endGameText").transition().duration(500).attr("y", window.innerHeight/2 - 250)
    d3.select(".endGameSUBMIT").transition().duration(500).attr("y", window.innerHeight/2 - 250 + 50)

}

function addDot() {
    d3.select(".endGameText")
        .transition()
        .duration(250)
        .attr("x", window.innerWidth/4 - 25)
        .text("Reticulating splines..")
}

function addDot2() {
    d3.select(".endGameText")
        .transition()
        .duration(250)
        .attr("x", window.innerWidth/4 - 25)
        .text("Reticulating splines...")
}

function countIndividuals(status) {
    var counter = 0;
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == status) counter++;
    }
    return counter;
}


function recordScores() {
    var quarantinedIndividuals = countIndividuals("Q");
    var proportionQuarantined = quarantinedIndividuals/graph.nodes.length;

    var vaccinatedIndividuals = countIndividuals("V");
    var proportionVaccinated = vaccinatedIndividuals/graph.nodes.length;

    var savedIndividuals = numberOfIndividuals - vaccinatedIndividuals - quarantinedIndividuals - countIndividuals("R") - countIndividuals("I");
    var proportionSaved = savedIndividuals/graph.nodes.length;

    var totalUninfected = savedIndividuals + quarantinedIndividuals + vaccinatedIndividuals;
    var proportionUninfected = totalUninfected/graph.nodes.length;

    // larger is better
    var indirectSaveRatio =  savedIndividuals / (quarantinedIndividuals + vaccinatedIndividuals)

    // save cookie
//    var currentScenarioScoresCookie = {scenario: scenarioTitle, difficulty: difficulty, speedMode:speed, quarantined: quarantinedIndividuals, saved: savedIndividuals};
    var currentScenarioScoresCookie = {scenario: scenarioTitle, difficulty: difficulty, speedMode:speed, outbreaks:independentOutbreaks, refusers:numberOfRefusers, vax: vaccinatedIndividuals, quarantined: quarantinedIndividuals, saved: savedIndividuals, netSize: numberOfIndividuals};

    var saves = $.cookie('vaxSaves');
    saves += savedIndividuals;
    $.cookie('vaxSaves', saves, { expires: 365, path: '/' })

    $.cookie('vaxCurrentScenarioScores', JSON.stringify(currentScenarioScoresCookie), { expires: 365, path: '/' })
    console.log($.cookie('vaxCurrentScenarioScores'))

    modifyUnlocks();
    window.location.href = '/scores'
}

function modifyUnlocks() {
    unlocks = $.cookie('vaxUnlocks')

    if (scenarioTitle == "Workplace / School") {
        if (difficulty == "easy") unlocks.work.difficulty.medium = true;
        if (difficulty == "medium") unlocks.work.difficulty.hard = true;

    }

    if (scenarioTitle == "Movie Theater / Lecture Hall") {
        if (difficulty == "easy") unlocks.theater.difficulty.medium = true;
        if (difficulty == "medium") unlocks.theater.difficulty.hard = true;

    }

    if (scenarioTitle == "Restaurant") {
        if (difficulty == "easy") unlocks.restaurant.difficulty.medium = true;
        if (difficulty == "medium") unlocks.restaurant.difficulty.hard = true;

    }

    if (scenarioTitle == "Organization") {
        if (difficulty == "easy") unlocks.club.difficulty.medium = true;
        if (difficulty == "medium") unlocks.club.difficulty.hard = true;

    }

    if (scenarioTitle == "Endless Queue") {
        if (difficulty == "easy") unlocks.shop.difficulty.medium = true;
        if (difficulty == "medium") unlocks.shop.difficulty.hard = true;
    }

    if (scenarioTitle == "Random Networks") {
        if (difficulty == "easy") unlocks.original.difficulty.medium = true;
        if (difficulty == "medium") unlocks.original.difficulty.hard = true;
    }

    var stringifiedUnlocks = JSON.stringify(unlocks);
    $.cookie('vaxUnlocks', stringifiedUnlocks, { expires: 365, path: '/' })
    console.log($.cookie('vaxUnlocks'))
}

function getCartesianDistance(originalLocation, newLocation) {
    var x1 = originalLocation[0];
    var y1 = originalLocation[1];
    var x2 = newLocation[0];
    var y2 = newLocation[1];
    var squaredDeltaX = Math.pow(x1 - x2, 2)
    var squaredDeltaY = Math.pow(y1 - y2, 2)
    return Math.pow(squaredDeltaX + squaredDeltaY, 0.5)
}


jQuery(document).bind('keydown', function (evt){
    if (currentNode == undefined) return;

    if (evt.shiftKey && evt.which == 32) {
        currentNode.fixed = false;
        currentElement.style("stroke-width", "2px")
    }
    else {
        if (evt.which == 32) {
            currentNode.fixed = true;
            currentElement.style("stroke-width", "3px")
        }
    }
});
