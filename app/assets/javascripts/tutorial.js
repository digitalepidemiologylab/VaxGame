var numberOfIndividuals = 75;
var rewire = 0.10;
var meanDegree = 3;
var diseaseIsSpreading = false;
var transmissionRate = .25;
var recoveryRate = 0;
var maxRecoveryTime = 1000;
var vaccinateMode = false;
var graph = generateSmallWorld(numberOfIndividuals,rewire,meanDegree);
var timeToStop = false;
var guideRailsPosition = 0;
var postInitialOutbreak = false;
var finalStop = false;
var endGame = false;
var nonIntervention_series = [];
var intervention_series = [];
var intervention = false;
var tutorial = false;
var charge = -500;


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

var player = graph.nodes[0];

trivialGraph = {};
trivialGraph.nodes = [];
trivialGraph.links = [];

trivialGraph.nodes.push(player);

var width = 800,
    height = 700,
    svg;

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg")
    .attr("pointer-events", "all")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('svg:g');

// initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
var force = d3.layout.force()
    .nodes(trivialGraph.nodes)
    .links(trivialGraph.links)
    .size([width, height])
    .charge(charge)
    .on("tick", tick)
    .start();

// associate empty SVGs with link data. assign attributes.
var link = svg.selectAll(".link")
    .data(trivialGraph.links)
    .enter().append("line")
    .attr("class", "link");

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.
var node = svg.selectAll(".node")
    .data(trivialGraph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 15)
    .style("stroke", 10)
    .style("fill", "#37FDFC")
    .call(force.drag)
    .on("click", function(d) {
        if (vaccinateMode) {
            if (vaccineSupply <= 0) {
                window.alert("Out of Vaccines!")
                return;
            }
            d.status = "V";
            vaccineSupply--;
            tutorialUpdate();
        }
        else {
            if (diseaseIsSpreading==true) return;
            d.status = "I";
            tutorialUpdate();
            tutorialTimesteps();
            diseaseIsSpreading=true;
            spreadingText();
        }

    });

var guide = d3.select(".svg").append("text")
    .attr("class", "guide")
    .attr("x",300).attr("y",200)
    .attr("font-size", 20)
    .text("")

var microGuide = d3.select(".svg").append("text")
    .attr("class", "microGuide")
    .attr("x",250).attr("y",-10)
    .attr("font-size", 12)
    .text("")



window.setTimeout(guideStart, 1200);

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
    var nodes = graph.nodes;
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
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#37FDFC";
            if (d.status == "E") color = "#ff0000";
            if (d.status == "I") color = "#ff0000";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#ffff00";

            return color;});

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 8)
        .style("stroke", 10)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#37FDFC";
            if (d.status == "E") color = "#ff0000";
            if (d.status == "I") color = "#ff0000";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#ffff00";

            return color;

        })
        .on("click", function(d) {
            if (vaccinateMode) {
                if (vaccineSupply <= 0) {
                    window.alert("Out of Vaccines!")
                    return;
                }
                d.status = "V";
                vaccineSupply--;
                tutorialUpdate();
            }
            else {
                if (diseaseIsSpreading==true) return;   // prevent secondary introductions
                d.status = "I";
                tutorialUpdate();
                tutorialTimesteps();
                diseaseIsSpreading=true;
                spreadingText();

            }

        })
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    d3.select(".vaccineSupply")
        .text("Vaccines Remaining: " + vaccineSupply)

    if (vaccineSupply == 0 && postInitialOutbreak == true) {
        vaccinateMode = false;
        window.setTimeout(postVaccinationGuideRails, 1000)
    }
}

function buildGraph() {
    tutorial = true;
    for (var nodeIndex = 1; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        trivialGraph.nodes.push(node);
        tutorialUpdate();
    }

    for (var linkIndex = 0; linkIndex < graph.links.length; linkIndex++) {
        var link = graph.links[linkIndex];
        trivialGraph.links.push(link);
        tutorialUpdate();
    }

    graph = trivialGraph;
}

function tutorialTimesteps() {
    updateExposures();
    infection();
    stateChanges();

    var I;
    if (intervention) {
        I = getStatuses("I");
        intervention_series.push({group:"Intervention", time:timestep, value:I});
        updateTutorialFig();
    }
    else {
        I = getStatuses("I");
        nonIntervention_series.push({group:"nonIntervention", time:timestep, value:I});
        intervention_series.push({group:"Intervention", time:timestep, value:0});
    }


    tutorialUpdate();
    this.timestep++;
    d3.select(".timestepTicker")
        .text("Day: " + timestep);
    detectCompletion();

    if (timeToStop == false) {
        window.setTimeout(tutorialTimesteps, 600);
    }

    if (timeToStop == true) {
        if (finalStop == true) return;
        guideRailsPosition = 0;
        window.setTimeout(guideRails_postOutbreak(), 1500);
    }




}



function detectCompletion() {
    var numberOfInfecteds = 0;
    for (var nodeIndex = 0; nodeIndex < trivialGraph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        if (node.status == "I") numberOfInfecteds++;
    }
    if (numberOfInfecteds == numberOfIndividuals) timeToStop = true;


    if (finalStop) {
      detectEndGame();
      if (endGame) {
          timeToStop = true;
          while (timestep < nonIntervention_series.length) {

              updateExposures();
              infection();
              stateChanges();
              this.timestep++;
              intervention_series.push({group:"Intervention", time:timestep, value:getStatuses("I")});
              updateTutorialFig();
          }

      }
    }
}

function completeSeries() {
    var discrepancy;

    if (nonIntervention_series.length > intervention_series.length) {
        discrepancy = nonIntervention_series.length - intervention_series.length;

        for (var i = intervention_series.length; i < discrepancy; i++) {
            tutorialSeries[1].push(intervention_series[intervention_series.length-1])

        }

    }
    else {
        discrepancy = intervention_series.length - nonIntervention_series.length;

        for (var i = intervention_series.length; i < discrepancy; i++) {
            tutorialSeries[0].push(nonIntervention_series[nonIntervention_series.length-1])

        }


    }




}

function guideStart() {
    d3.select(".guide")
        .attr("x",300).attr("y",200)
        .attr("font-size", 20)
        .text("Suppose this is you")

    window.setTimeout(guideRails, 1000);
}


function guideRails() {
    guideRailsPosition++;

    if (guideRailsPosition == 1) {
        d3.select(".guide")
            .transition()
            .duration(500)
            .text("Suppose this is you")

        window.setTimeout(guideRails, 500)

    }

    if (guideRailsPosition == 2) {
        d3.select(".guide")
            .transition()
            .duration(500)
            .text("Suppose this is you.")

        window.setTimeout(guideRails, 500)

    }

    if (guideRailsPosition == 3) {
        d3.select(".guide")
            .transition()
            .duration(500)
            .text("Suppose this is you..")

        window.setTimeout(guideRails, 500)

    }

    if (guideRailsPosition == 4) {
        d3.select(".guide")
            .transition()
            .duration(500)
            .text("Suppose this is you...");

        window.setTimeout(guideRails, 500)

    }

    if (guideRailsPosition == 5) {
        buildGraph();

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("x", 250).attr("y", 15)
            .text("and this is your contact network")

        window.setTimeout(guideRails, 500)
    }

    if (guideRailsPosition == 6) {
        d3.select(".microGuide")
            .transition()
            .duration(500)
            .attr("x",242).attr("y",35)
            .attr("font-size", 12)
            .text("e.g., everyone you've come in close contact with recently")

        window.setTimeout(outbreakText, 5000);
    }

}

function outbreakText() {
    d3.select(".guide")
        .transition()
        .duration(500)
        .attr("x", 185).attr("y", 15)
        .text("Now, suppose someone is bitten by a zombie...")

    d3.select(".microGuide")
        .transition()
        .duration(500)
        .attr("x",312).attr("y",35)
        .attr("font-size", 12)
        .text("(click any circle below to continue)")

}

function spreadingText() {
    d3.select(".guide")
        .transition()
        .duration(500)
        .attr("x", 225).attr("y", 15)
        .text("Within weeks, everyone will be infected.")

    d3.select(".microGuide")
        .transition()
        .duration(500)
        .attr("x",275).attr("y",35)
        .attr("font-size", 12)
        .text("(zombies don't recover...because they're zombies)")

    var timestepTicker = d3.select(".svg").append("text")
        .attr("class", "timestepTicker")
        .attr("x",380).attr("y",65)
        .attr("font-size", 20)
        .text("Day: " + timestep);

}

function guideRails_postOutbreak() {

    guideRailsPosition++;

    if (guideRailsPosition == 1) {

        d3.select(".timestepTicker").text("")

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("x",150).attr("y",15)
            .text("But, if we had a 'zombie vaccine' we could prepare...")

        d3.select(".microGuide")
            .transition()
            .duration(500)
            .attr("x",275).attr("y",-10)
            .attr("font-size", 12)
            .text("")

        window.setTimeout(guideRails_postOutbreak, 2000)

    }

    if (guideRailsPosition == 2) {

        d3.select(".microGuide")
            .transition()
            .duration(500)
            .attr("x",345).attr("y",40)
            .attr("font-size", 12)
            .text("So let's start over...")


        window.setTimeout(guideRails_postOutbreak, 2000)

    }

    if (guideRailsPosition == 3) {
        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("x",150).attr("y",-30)
            .text("But, if we had a 'zombie vaccine' we could prepare...")


        d3.select(".microGuide")
            .transition()
            .duration(500)
            .attr("x",345).attr("y",-50)
            .attr("font-size", 12)
            .text("So let's start over...")

        window.setTimeout(guideRails_postOutbreak, 500)


    }

    if (guideRailsPosition == 4) {
        for (var i = 0; i < graph.nodes.length; i++) {
            graph.nodes[i].status = "S";
        }

        tutorialUpdate();
        window.setTimeout(guideRails_postOutbreak, 1000)

    }

    if (guideRailsPosition == 5) {
        d3.select(".guide")
            .transition()
            .duration(1000)
            .attr("x",125).attr("y",25)
            .text("Efficient distribution of vaccines can 'fragment' the network")

        d3.select(".microGuide")
            .transition()
            .duration(5000)
            .attr("x",300).attr("y",50)
            .text("(making it harder for diseases to spread)")


        window.setTimeout(guideRails_postOutbreak, 7000)

    }

    if (guideRailsPosition == 6) {
        intervention = true;
        intervention_series = [];



        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("x",85).attr("y",25)
            .text("Vaccinate people to break this network up into smaller 'communities'")

        d3.select(".microGuide")
            .transition()
            .duration(500)
            .attr("x",250).attr("y",50)
            .text("(click circles below to vaccinate, vaccines are limited)")


        window.setTimeout(guideRails_postOutbreak, 1000);

        vaccineResearched = true;
        vaccineSupply = numberOfIndividuals * 0.20;
        diseaseIsSpreading = false;
        vaccinateMode = true;
        postInitialOutbreak = true;

        d3.select(".svg").append("text")
            .attr("class", "vaccineSupply")
            .attr("x", 300)
            .attr("y", 85)
            .attr("font-size", 17)
            .text("Vaccines Remaining: " + vaccineSupply)
    }
}

function postVaccinationGuideRails() {


    d3.select(".vaccineSupply")
        .transition()
        .duration(500)
        .attr("y", -20)
        .attr("font-size", 17)
        .text("Vaccines Remaining: " + vaccineSupply)


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


    d3.select(".timestepTicker")
        .attr("x",380).attr("y", 75)
        .attr("font-size", 20)
        .text("Day: " + timestep);

    initFigure();
    tutorialTimesteps();



}

function initFigure() {
    tutorialSeries = [
        [{group: "Intervention", time: 0, value: 0}],
        [{group: "No Intervention", time: 0, value: 0}]
    ];

    d3.select("body").append("div3");

    colorScale = d3.scale.category10();

// canvas margins
    figMargin = {top: 70, right: 10, bottom: 20, left: 90},
        figWidth = 400 - figMargin.left - figMargin.right,
        figHeight = 230 - figMargin.top - figMargin.bottom;

// x scale
    figX = d3.scale.linear()
        .domain([0, 20])
        .range([0, figWidth]);

// y scale
    figY = d3.scale.linear()
        .domain([0, numberOfIndividuals])
        .range([figHeight, 0]);

// the lines
    figLines = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return figX(d.time); })
        .y(function(d) { return figY(d.value); });


// the svg canvas
    svgTutorial = d3.select("div3").append("svg")
        .attr("width", figWidth + figMargin.left + figMargin.right)
        .attr("height", figHeight + figMargin.top + figMargin.bottom)
        .attr("class", "svgTutorial")
        .append("g")
        .attr("transform", "translate(" + figMargin.left + "," + figMargin.top + ")");


    yLab = d3.select(".svgTutorial").append("text")
        .attr("x", 5).attr("y", 115)
        .attr("font-weight", "bold")
        .attr("transform", "rotate(320 55,125)")
        .text("Infected");

    xLab = d3.select(".svgTutorial").append("text")
        .attr("x", 276).attr("y", 250)
        .attr("font-weight", "bold")
        .text("Day");


    nonInterventionLegend = d3.select(".svgTutorial").append("line")
        .attr("x1", 116).attr("y1", 20)
        .attr("x2", 166).attr("y2", 20)
        .style("stroke", "ff7f0e")
        .style("stroke-width", 5)

    nonInterventionLab = d3.select(".svgTutorial").append("text")
        .attr("x", 90).attr("y", 40)
        .text("Without Vaccines")

    interventionLegend = d3.select(".svgTutorial").append("line")
        .attr("x1", 260).attr("y1", 20)
        .attr("x2", 310).attr("y2", 20)
        .style("stroke", "#1f77b4")
        .style("stroke-width", 5)

    interventionLab = d3.select(".svgTutorial").append("text")
        .attr("x", 245).attr("y", 40)
        .text("With Vaccines")


// append lines to canvas
    svgTutorial.selectAll(".line")
        .data(tutorialSeries)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", figLines)
        .style("stroke-width", 5)
        .style("stroke", function(d) {return colorScale(d[0].group)});


//x-axis
    svgTutorial.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + figHeight + ")")
        .call(d3.svg.axis().scale(xFig).orient("bottom"))

//y-axis
    svgTutorial.append("g")
        .attr("class", "y-axis")
        .call(d3.svg.axis().scale(figY).orient("left"));


}

function updateTutorialFig() {

    updateTutorialSeries();

    d3.selectAll("path")
        .data(tutorialSeries) // set the new data
        .transition()
        .attr("d", figLines) // apply the new data values

}

function updateTutorialSeries() {

        tutorialSeries = [
            [{group: "nonIntervention", time: 0, value: 0}],
            [{group: "Intervention", time:0, value:0}]
        ];

        for (var time = 0; time < timestep-1; time++) {
            tutorialSeries[0].push(nonIntervention_series[time]);
            tutorialSeries[1].push(intervention_series[time]);
        }
    console.log(tutorialSeries);

}




