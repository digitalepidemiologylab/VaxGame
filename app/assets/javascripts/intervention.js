var numberOfIndividuals = 150;
var rewire = 0.10;
var meanDegree = 4;
var graph = generateSmallWorld(numberOfIndividuals,rewire,meanDegree);
var diseaseIsSpreading = false;
var maxRecoveryTime = 1000;

var transmissionRate = .15;
var recoveryRate = 0.15;

// select "body" section, and append an empty SVG with height and width values
var width = 900,
    height = 700,
    svg;

var timeToStop = false;

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg")
    .attr("pointer-events", "all")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('svg:g');


function drawEverything() {
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
        .attr("r", 8)
        .style("stroke", 10)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#37FDFC";
            if (d.status == "E") color = "#ff0000";
            if (d.status == "I") color = "#ff0000";
            return color;
        })
        .call(force.drag)
        .on("click", function(d) {
            if (diseaseIsSpreading==true) return;
            d.status = "I";
            interventionUpdate();
            interventionTimesteps();
            diseaseIsSpreading=true;
            d3.select(".hint2")
                .text("");

            d3.select(".hint")
                .transition()
                .duration(500)
                .attr("x",154)
                .text("Without intervention, everyone is infected within weeks")

            d3.select(".hintBox")
                .transition()
                .duration(500)
                .attr("x",150)
                .attr("width", 575)
        });


    var interventionBox = d3.select(".svg").append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("height", 40).attr("width", 80)
        .attr("class", "interventionBox")
        .style("stroke", 10)
        .style("fill", "yellow")

    var interventionTimestepTicker = d3.select(".svg").append("text")
        .attr("class", "interventionTimestepTicker")
        .attr("x",6).attr("y",27)
        .attr("font-size", 20)
        .text("Day: " + timestep);

    interventionUpdate();
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

function interventionUpdate() {

    force
        .nodes(graph.nodes)
        .charge(charge)
        .links(graph.links)
        .start();

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(graph.nodes, function(d) { return d.id; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#37FDFC";
            if (d.status == "E") color = "#ff0000";
            if (d.status == "I") color = "#ff0000";
            if (d.status == "R") color = "#9400D3";
            return color;

        });


    link = svg.selectAll("line.link")
        .data(graph.links, function(d) { return d.source.id + "-" + d.target.id;});

    if (timestep > 9) {
        d3.select(".interventionBox")
            .transition()
            .duration(500)
            .attr("width", 95)
    }

    d3.select(".interventionTimestepTicker")
        .text("Day: " + timestep);


}

function interventionTimesteps() {
    updateExposures();
    infection();
    stateChanges();
    interventionUpdate();
    this.timestep++;
    detectCompletion();
    if (timeToStop == false) {
        window.setTimeout(interventionTimesteps, 600);
    }
}

function detectCompletion() {
    var numberOfInfecteds = 0;
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
         var node = graph.nodes[nodeIndex];
        if (node.status == "I") numberOfInfecteds++;
    }
    if (numberOfInfecteds == numberOfIndividuals) timeToStop = true;
}

var hintBox = d3.select(".svg").append("rect")
    .attr("x", 250).attr("y", 235)
    .attr("height", 35).attr("width", 335)
    .attr("class", "hintBox")
    .style("stroke", 10)
    .style("fill", "lightblue")
    .on("click",clickHint)

var hint = d3.select(".svg").append("text")
    .attr("class", "hint")
    .attr("x",260).attr("y",260)
    .attr("font-size", 20)
    .text("Imagine your social network...")
    .on("click",clickHint)

function clickHint() {
    drawEverything();

    d3.select(".hintBox")
        .transition()
        .duration(500)
        .attr("y", 0)
        .attr("width", 470)

    d3.select(".hint")
        .transition()
        .duration(500)
        .attr("y",25)
        .text("Now, suppose a friend gets bit by a zombie...")

    window.setTimeout(displaySecondHint, 1000)
}

function displaySecondHint() {
    var hint2 = d3.select(".svg").append("text")
        .attr("class", "hint2")
        .attr("x", 585)
        .attr("y", 50)
        .attr("font-size", 12)
        .text("(click a circle below)")

}




