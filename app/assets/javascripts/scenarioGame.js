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
var width = 700;
var height = 600 - 45 - 50;  // standard height - footer:height - footer:bottomMargin
var charge = -500;
var friction = 0.9;

// d3 force directed
var force;

runScenario();

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
    if (cookies == undefined) window.location.href = 'http://0.0.0.0:3000/scenario'
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
    if (scenarioTitle == "Workplace / School") graph = initWorkNet();
    if (scenarioTitle == "Movie Theater / Lecture Hall") graph = initTheaterNet();
    if (scenarioTitle == "Restaurant") graph = initRestaurantNet();
    if (scenarioTitle == "Organization") graph = initClubNet();
    if (scenarioTitle == "Shopping") graph = initShopNet();
    if (scenarioTitle == "Random Networks") graph = initRandomNet();

    if (numberOfRefusers > 0) createRefusers();

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
    d3.select("#newGameNav").on("click", function() {window.location.href = 'http://0.0.0.0:3000/scenario'})


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

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.

    clickArea = scenarioSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "clickArea")
        .attr("r", function(node) {
            return (1.5 * nodeSizing(node));
        })
        .attr("opacity", 0)
        .call(force.drag)
        .on("click", function(node) {
            if (speed) speedModeClick(node);
            else turnModeClick(node);
        })

    node = scenarioSVG.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", nodeSizing)
        .attr("fill", nodeColoring)
        .call(force.drag)
        .on("click", function(node) {
            if (speed) speedModeClick(node);
            else turnModeClick(node);
        })
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
    infection();
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
    infection();
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
                currentSize = (findNeighbors(node).length + 1.5) * 1.9;
                if (meanDegree > 3) currentSize = (findNeighbors(node).length+1) * 1.65;
                if (meanDegree > 4) currentSize = (findNeighbors(node).length+1) * 1.25;

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

function update() {
    friction = 0.83;

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
        .attr("r", function(node) {
            if (node.degree = 0) return 0;
            return 1.5 * nodeSizing(node)
        })



    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill", nodeColor)
        .on("click", function(node) {
            if (speed) speedModeClick(node)
            else turnModeClick(node);
        })
        .call(force.drag);

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
    d3.selectAll(".node").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".gameSVG").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".vaccineCounterText").text(numberOfVaccines);
    d3.select(".vaccineDepressedState").style("visibility", "visible")

}

function activateQuarantinePhase() {
    vaccinateMode = false;
    quarantineMode = true;
    d3.selectAll(".node").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".gameSVG").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".quarantineDepressedState").style("visibility", "visible");


    // prevent accidental creation of new index patients after initial infections
    var counter = 0;
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == "I" || graph.nodes[i].status == "R") counter++;
    }
    if (counter == 0) createIndexPatients();

}

function createIndexPatients() {
    quarantineMode = true;
    diseaseIsSpreading = true;
    var indexPatientID = 0;
    while(independentOutbreaks > 0) {
        do {
            indexPatientID = Math.floor(Math.random() * graph.nodes.length);
        }
        while (graph.nodes[indexPatientID].status != "S");

        graph.nodes[indexPatientID].status = "I";
        graph.nodes[indexPatientID].infectedBy = "indexPatient";
        graph.nodes[indexPatientID].exposureTimestep = 0;
        independentOutbreaks--;

    }
    outbreakNotify();
    update();

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
    if (toggleDegree) {
        size = (findNeighbors(node).length + 1.5) * 1.9;
        if (meanDegree > 3) size = (findNeighbors(node).length+1) * 1.65;
        if (meanDegree > 4) size = (findNeighbors(node).length+1) * 1.25;

    }
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


function endScenario() {
    gameIsOver = true;
    console.log("end")
    $.removeCookie('vaxCurrentGame', { path: '/' });

}