var link;
var node;
var force;

function hiAdvance() {

    if (hiGuide == 1) {

        d3.select("#hiGuideText").html("What is Herd Immunity?")
        d3.select("#hiHeader").transition().duration(1000).attr("opacity", 0)
        d3.select("#advanceHI").text("Next >")

        var base_hiNet = generateSmallWorld(50, 0.1, 4);


        for (var i = 0; i < base_hiNet.nodes.length; i++) {
            if (Math.random() < 0.15) base_hiNet.nodes[i].status = "S";
            else base_hiNet.nodes[i].status = "V";
        }

        // initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
        force = d3.layout.force()
            .nodes(base_hiNet.nodes)
            .links(base_hiNet.links)
            .size([width, height])
            .charge(-500)
            .friction(0.90)
            .on("tick", hiTick)
            .start();

// associate empty SVGs with link data. assign attributes.
        link = hiSVG.selectAll(".link")
            .data(base_hiNet.links)
            .enter().append("line")
            .attr("class", "link");

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.
        node = hiSVG.selectAll(".node")
            .data(base_hiNet.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 8)
            .attr("fill", nodeColor)
            .call(force.drag)

    }

}

// tick function, which does the physics for each individual node & link.
function hiTick() {
    node.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 8, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min((height *.85), d.y)); });
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
}

