var playNetSVG;
var link;
var force;
var node;
var graph;

var leftBound = 0;
var rightBound = 100;
var topBound = 105;
var bottomBound = 15;

function drawPlayNet() {
    graph = generateSmallWorld(100, 0.10, 4)

    removeDuplicateEdges(graph);

    playNetSVG = d3.select("#hiSVG").append("g")
        .attr("id", "playNetSVG")
        .attr("height", 600)
        .attr("width", 400)


    force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .charge(-400)
        .friction(0.7)
        .gravity(0.0075)
        .on("tick", hiTick)
        .start();

    link = playNetSVG.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .style("stroke-width", "2px")
        .attr("class", "link");

    node = playNetSVG.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 12)
        .attr("fill", "#b7b7b7")
        .call(force.drag)

}

function drawRepeatNet() {
    d3.select("#playNetSVG").remove()

    graph = generateSmallWorld(100, 0.10, 4)

    removeDuplicateEdges(graph);

    playNetSVG = d3.select("#hiSVG").append("g")
        .attr("id", "playNetSVG")
        .attr("height", 300)
        .attr("width", 300)


    force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .charge(-200)
        .friction(0.7)
        .gravity(0.0075)
        .on("tick", hiTick)
        .start();

    link = playNetSVG.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .style("stroke-width", "2px")
        .attr("class", "link");

    node = playNetSVG.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 13)
        .attr("fill", "#b7b7b7")
        .call(force.drag)

    leftBound = 0;
    rightBound = 550;
    bottomBound = 50;



}


function hiTick() {
    node.attr("cx", function(d) { return d.x = Math.max(leftBound, Math.min(width - rightBound, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(topBound, Math.min(height - bottomBound, d.y)); });
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    if (globalMaxConnectedLabel != null) {
        globalMaxConnectedLabel.attr("x", globalMax.x - 4).attr("y", globalMax.y + 6)
    }


}