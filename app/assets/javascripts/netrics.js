function generateSmallWorld(n, p, k) {
    var vertices = [];
    var edges = [];
    var nodes = [];
    for (var nodeCreateID = 0; nodeCreateID < n; nodeCreateID++) {
        vertices.push(nodeCreateID);
        var nodeString = {id:vertices[nodeCreateID], status:"S", group:null, edges:[], marked:false, degree:null, bcScore:null, exposureTimestep:null, infectedBy:null};
        nodes.push(nodeString);
    }
    for (var nodeID = 0; nodeID < n; nodeID++) {
        for (var edgeID = 0; edgeID < k; edgeID++) {
            var diff = Math.floor((edgeID / 2) + 1);
            if (edgeID%2 == 1) diff *= -1;
            var newIndex = nodeID + diff;
            if (newIndex < 0) newIndex+=n;
            if (newIndex >= n) newIndex -= n;
            var edge = [nodeID, newIndex];
            edges.push(edge);
        }
    }

    var doubleEdge = false;
    for (var edgeIndex = 0; edgeIndex < edges.length; edgeIndex++) {
        if (Math.random() < p) {
            var source = edges[edgeIndex][0];
            do {
                var randomIndex = Math.floor(Math.random() * n);
                var newDestination = vertices[randomIndex];
            }
            while(source == newDestination);  // at this stage, duplicate edges still possible, removed later
            edges[edgeIndex][1] = newDestination;
        }
    }
    var graph = {};
    var links = [];
    for (var i = 0; i < edges.length; i++) {
        var linkString = {source:edges[i][0],target:edges[i][1],remove:false};
        if (!testDuplicate(links, linkString)) links.push(linkString);    // here is where we get rid of duplicate edges
    }
    graph.nodes = nodes;
    graph.links = links;
    return graph;
}

function removeDuplicateEdges(graph) {
    for (var ii = 0; ii < graph.nodes.length; ii++) {
        var node1 = graph.nodes[ii];
        for (var iii = 0; iii < graph.nodes.length; iii++) {
            var node2 = graph.nodes[iii];
            spliceDuplicateEdges(node1, node2, graph)
        }
    }
}

function testDuplicate(links, linkString) {
    var testSource = linkString.source;
    var testTarget = linkString.target;
    var duplicate = false;
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var source = link.source;
        var target = link.target;
        if (source == testSource && target == testTarget) duplicate = true;
        if (source == testTarget && target == testSource) duplicate = true;
    }
    return duplicate;
}

// basic functions

function degree(node) {
    var degree = 0;
    for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source == node || graph.links[i].target == node) degree++;
    }
    return degree;
}

function findNeighbors(node) {
    var neighbors = [];
    for (var i = 0; i < graph.links.length; i++) {
        var testLink = graph.links[i];
        if (testLink.source == node) neighbors.push(testLink.target);
        if (testLink.target == node) neighbors.push(testLink.source);
    }
    return neighbors;
}

function findLink(source, target) {
    var link = null;
    for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source == source && graph.links[i].target == target) link = graph.links[i];
        if (graph.links[i].target == source && graph.links[i].source == target) link = graph.links[i];
    }
    return link;
}


function edgeExists(source, target, graph) {
    var edgeExists = false;
    for (var i = 0; i < graph.links.length; i++) {
        var link = graph.links[i];
        if (link.source.id == source.id) {
            if (link.target.id == target.id) {
                edgeExists = true;
            }
        }
        else {
            if (link.target.id == source.id) {
                if (link.source.id == target.id) {
                    edgeExists = true;
                }
            }
        }
    }
    return edgeExists;
}

function spliceDuplicateEdges(source, target, graph) {
    var edgeExists = 0;
    for (var i = 0; i < graph.links.length; i++) {
        var link = graph.links[i];

        // test one direction
        if (link.source.id == source.id) {
            if (link.target.id == target.id) {
                //this is one direction
                edgeExists++;

            }
        }

        // test the other direction
        if (link.target.id == source.id) {
            if (link.source.id == target.id) {
                //this is another direction
                edgeExists++;
            }
        }

        // if a duplicate is found then splice it, and continue testing (knowing that any more duplicate edges should definitely be removed)
        if (edgeExists > 1) {
            edgeExists = 1;
            graph.links.splice(i,1);
        }
    }
    return edgeExists;
}

function removeVaccinatedNodes(graph) {
    var nodes = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status != "V" && graph.nodes[i].status != "Q" && graph.nodes[i].status != "VOL") {
            nodes.push(graph.nodes[i]);
        }
    }
    return nodes;
}

function removeOldLinks(graph) {
    var links = [];
    for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.status == "V") continue;
        if (graph.links[i].target.status == "V") continue;
        if (graph.links[i].source.status == "R") continue;
        if (graph.links[i].target.status == "R") continue;
        if (graph.links[i].source.status == "Q") continue;
        if (graph.links[i].target.status == "Q") continue;
        if (graph.links[i].remove == true) continue;

        links.push(graph.links[i]);
    }
    return links;
}

function assignEdgeListsToNodes(graph) {

    for (var ii = 0; ii < graph.nodes.length; ii++) {
        var node = graph.nodes[ii];
        for (var i = 0; i < graph.links.length; i++) {
            var link = graph.links[i];
            if (link.source == node || link.target == node) node.edges.push(link);
        }
    }
    return graph;
}

function updateCommunities() {
    twine = [];
    twineIndex = 0;
    groupCounter = 1;
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        node.group = null;
        node.marked = false;
    }

    assignGroups();

}


function assignGroups() {
    while(true) {
        var unassigned = getUnmarkedUngroupedNodes();
        if (unassigned.length == 0) {
            numberOfCommunities = groupCounter - 1;
            break;
        }
        if (pacMan(unassigned[0]) && unassigned.length != 0) {
            groupCounter++;
        }
    }
}

function getUnmarkedUngroupedNodes() {
    var unmarkedNodes = [];
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        if (node.marked == false) unmarkedNodes.push(node);
    }
    return unmarkedNodes;
}

function pacMan(node) {
    node.group = groupCounter;
    var nextNode = null;
    if (node != null && !node.marked) {
        node.marked = true;
        node.group = groupCounter;
        twine.push(node);
        var nodeDegree = degree(node);
        var neighbors = findNeighbors(node);
        for (var completionCounter = 0; completionCounter < nodeDegree; completionCounter++) {
            var nodeToCheck = neighbors[completionCounter];
            if (!nodeToCheck.marked) {
                nextNode = nodeToCheck;
                pacMan(nextNode);
            }
        }
    }
    if (node == null && twineIndex != 0) {
        twineIndex =- 1;
        nextNode = twine[twineIndex];
        pacMan(nextNode);
    }
    else {
        return true;
    }
}

function findLargestCommunity() {
    communities = [];
    for (var i = 0; i < groupCounter; i++) {
        communities[i] = 0;
    }
    for (var ii = 0; ii < groupCounter; ii++) {
        for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
            if (graph.nodes[nodeIndex].group == ii) communities[ii]++;
        }
    }
    largestCommunity = Array.max(communities);
}

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

function convertGraphForNetX(graph) {
    var vertices = [];
    var edges = [];
    var G = jsnx.Graph();
    for (var node = 0; node < graph.nodes.length; node++) {
        vertices.push(graph.nodes[node].id);
    }
    for (var edge = 0; edge < graph.links.length; edge++) {
        var formatted = [];
        formatted.push(graph.links[edge].source.id);
        formatted.push(graph.links[edge].target.id);
        edges.push(formatted);
    }
    G.add_nodes_from(vertices);
    G.add_edges_from(edges);
    return G;
}

function assignDegree() {
    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].degree = degree(graph.nodes[i]);
    }
}

function computeBetweennessCentrality() {
    G = convertGraphForNetX(graph);
    var bc = jsnx.betweenness_centrality(G);
    for (var i = 0; i < graph.nodes.length; i++) {
        if (bc[i] == 0) bc[i] = 0.0001;
        graph.nodes[i].bcScore = bc[i];
    }
    return bc;
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function getTailoredNodes() {
    // make nodes
    var tailoredNodes= [];
    for (var ii = 0; ii < 13; ii++) {
        var nodeString = {id:ii+13, status:"S", group:null, edges:[], marked:false, degree:null, bcScore:null, exposureTimestep:null, infectedBy:null};
        tailoredNodes.push(nodeString);
    }
    return tailoredNodes;
}



function cleanup(arr, prop) {
    var new_arr = [];
    var lookup  = {};

    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }

    for (i in lookup) {
        new_arr.push(lookup[i]);
    }

    return new_arr;
}




function getTailoredLinks() {
    // make links
    var tailoredLinks = [];
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

    return tailoredLinks;
}

function getWeakTieNodes() {
    var weakTieNodes = [];
    for (var i = 0; i < 30; i++) {
        var nodeString = {id:i, status:"S", group:null, edges:[], marked:false, degree:null, bcScore:null, exposureTimestep:null, infectedBy:null};
        weakTieNodes.push(nodeString);
    }
    return weakTieNodes;
}

function getWeakTieLinks() {
    var weakTieLinks = [
        {
            source:weakTieNodes[1],
            target:weakTieNodes[3],
            remove:false
        },
        {
            source:weakTieNodes[3],
            target:weakTieNodes[6],
            remove:false
        },
        {
            source:weakTieNodes[4],
            target:weakTieNodes[1],
            remove:false
        },
        {
            source:weakTieNodes[4],
            target:weakTieNodes[2],
            remove:false
        },
        {
            source:weakTieNodes[4],
            target:weakTieNodes[3],
            remove:false
        },
        {
            source:weakTieNodes[4],
            target:weakTieNodes[8],
            remove:false
        },
        {
            source:weakTieNodes[4],
            target:weakTieNodes[9],
            remove:false
        },
        {
            source:weakTieNodes[5],
            target:weakTieNodes[16],
            remove:false
        },
        {
            source:weakTieNodes[6],
            target:weakTieNodes[1],
            remove:false
        },
        {
            source:weakTieNodes[8],
            target:weakTieNodes[12],
            remove:false
        },
        {
            source:weakTieNodes[8],
            target:weakTieNodes[13],
            remove:false
        },
        {
            source:weakTieNodes[9],
            target:weakTieNodes[15],
            remove:false
        },
        {
            source:weakTieNodes[10],
            target:weakTieNodes[6],
            remove:false
        },
        {
            source:weakTieNodes[10],
            target:weakTieNodes[18],
            remove:false
        },
        {
            source:weakTieNodes[12],
            target:weakTieNodes[2],
            remove:false
        },
        {
            source:weakTieNodes[12],
            target:weakTieNodes[9],
            remove:false
        },
        {
            source:weakTieNodes[13],
            target:weakTieNodes[2],
            remove:false
        },
        {
            source:weakTieNodes[13],
            target:weakTieNodes[17],
            remove:false
        },
        {
            source:weakTieNodes[14],
            target:weakTieNodes[13],
            remove:false
        },
        {
            source:weakTieNodes[14],
            target:weakTieNodes[15],
            remove:false
        },
        {
            source:weakTieNodes[15],
            target:weakTieNodes[2],
            remove:false
        },
        {
            source:weakTieNodes[15],
            target:weakTieNodes[5],
            remove:false
        },
        {
            source:weakTieNodes[16],
            target:weakTieNodes[14],
            remove:false
        },
        {
            source:weakTieNodes[16],
            target:weakTieNodes[17],
            remove:false
        },
        {
            source:weakTieNodes[18],
            target:weakTieNodes[19],
            remove:false
        },
        {
            source:weakTieNodes[19],
            target:weakTieNodes[10],
            remove:false
        },
        {
            source:weakTieNodes[19],
            target:weakTieNodes[24],
            remove:false
        },
        {
            source:weakTieNodes[19],
            target:weakTieNodes[28],
            remove:false
        },
        {
            source:weakTieNodes[21],
            target:weakTieNodes[23],
            remove:false
        },
        {
            source:weakTieNodes[21],
            target:weakTieNodes[28],
            remove:false
        },
        {
            source:weakTieNodes[22],
            target:weakTieNodes[18],
            remove:false
        },
        {
            source:weakTieNodes[23],
            target:weakTieNodes[19],
            remove:false
        },
        {
            source:weakTieNodes[23],
            target:weakTieNodes[22],
            remove:false
        },
        {
            source:weakTieNodes[24],
            target:weakTieNodes[26],
            remove:false
        },
        {
            source:weakTieNodes[28],
            target:weakTieNodes[24],
            remove:false
        },
        {
            source:weakTieNodes[29],
            target:weakTieNodes[26],
            remove:false
        }
    ]
    return weakTieLinks;
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

function frontTick() {

    frontNode.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 50, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min(500 - 50, d.y)); });


    frontLink.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });


}

