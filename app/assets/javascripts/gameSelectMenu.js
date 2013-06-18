var menuGraph = {};

var nodes = [{id:0, name:"prevent", size:50}, {id:1, name:"quarantine", size:50}]

var links =[{id:0, source:0, target:1}];

menuGraph.nodes = nodes;
menuGraph.links = links;


var URL = null;

var width = 500,
    height = 500,
    svg;

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("weight", height)




// initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
var force = d3.layout.force()
    .nodes(menuGraph.nodes)
    .links(menuGraph.links)
    .size([width, height])
    .linkDistance(200)
    .charge(-1000)
    .on("tick", tick)
    .start();

// associate empty SVGs with link data. assign attributes.
var link = svg.selectAll(".link")
    .data(menuGraph.links)
    .enter().append("line")
    .attr("class", "link");

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.
var node = svg.selectAll(".node")
    .data(menuGraph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 50)
    .style("fill", colorMenu)
    .call(force.drag)
    .on("click", clickMenu)




function colorMenu(d) {
    var color = null;
    if (d.name == "prevent") color = '#0000ff';
    if (d.name == "quarantine") color = '#ff0000';
    if (d.name == "confirm prevent" || d.name == "confirm quarantine") color = '#ffff00';
    return color;
}


function clickMenu(d) {
    var node = null;
    var link = null;
    console.log(menuGraph);
    if (d.name == "prevent") {
        node = {id:2, name:"confirm prevent", size:25};
        link = {id:1, source:0, target:2};
        menuGraph.nodes.push(node);
        menuGraph.links.push(link);
        console.log(menuGraph);
    }

    if (d.name == "quarantine") {
        node = {id:3, name:"confirm quarantine", size:25}
        link = {id:2, source:1, target:3};
        menuGraph.nodes.push(node);
        menuGraph.links.push(link);
        console.log(menuGraph);
    }

    if (d.name == "confirm prevent") {
        URL = '/game';
        goToURL();

    }

    if (d.name == "confirm quarantine") {
        URL = '/quarantine';
        goToURL();


    }

    updateMenu();

}

function updateMenu() {
    var nodes = menuGraph.nodes;
    var links = menuGraph.links;
    force
        .nodes(nodes)
        .links(links)
        .start();

    // select all links, join them with new data, and save it to "link" variable
    link = svg.selectAll("line.link")
        .data(links, function(d) { return d.source.id + "-" + d.target.id; });

    // enter new links (unnecessary at the moment)
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
        .style("fill", colorMenu);

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) {return d.size})
        .style("fill", colorMenu)
        .on("click", clickMenu)
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();





    menuGraph.nodes = nodes;
    menuGraph.links = links;
}


function goToURL() {

    location.href = URL;


}



