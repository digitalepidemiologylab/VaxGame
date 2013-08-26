var twine = [];
var twineIndex = 0;
var numberOfCommunities = null;
var largestCommunity = null;
var communities = [];
var groupCounter = 1;
var bcScores = [];

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


function edgeExists(source,target, graph) {
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
        if (graph.links[i].source.status == "VOL") continue;
        if (graph.links[i].target.status == "VOL") continue;
        if (graph.links[i].remove == true) continue;

        links.push(graph.links[i]);
    }
    return links;
}
//
//****


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


