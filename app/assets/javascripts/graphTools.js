function degree(node) {
    var degree = 0;
    for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source == node || graph.links[i].target == node) degree++;
    }
    return degree;
}

function findNeighbors(sampleNode) {
    var neighbors = [];
    for (var i = 0; i < graph.links.length; i++) {
        var testLink = graph.links[i];
        if (testLink.source == sampleNode) neighbors.push(testLink.target);
        if (testLink.target == sampleNode) neighbors.push(testLink.source);
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


//****
// Currently unused methods for assigned edgeIDs and providing node's with an array of neighbors (adjList).
function assignEdgeIDs() {
    for (var id = 0; id < graph.links.length; id++) {
        var link = graph.links[id];
        link.id = id;
    }
}

function assignEdgesToNode(node) {
    var edges = [];
    for (var linkIndex = 0; linkIndex < graph.links.length; linkIndex++) {
        var link = graph.links[linkIndex];

        if (link.source == node.id || link.target == node.id) {
            edges.push(link.id);
        }
    }
    return edges;
}

function assignEdgesForAllNodes() {
    assignEdgeIDs();
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        node.edges = assignEdgesToNode(node);
    }
}
//
//****


//****
// These methods are used to generate a new graph based on a node status criteria, can handle 0 or 1.

function filterSusceptibleNodes(criteria) {

    var nodes = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].status == criteria) {
            nodes.push(graph.nodes[i]);
        }

        else {
            originalGraph.nodes[i].status = Math.abs(1-criteria);
        }
    }
    return nodes;
}

function filterLinks(criteria) {
    var links = [];
    for (var i = 0; i < graph.links.length; i++) {
        if (graph.links[i].source.status == criteria  && graph.links[i].target.status == criteria) {
            links.push(graph.links[i]);
        }
    }
    return links;
}
//
//****



//****
// These methods employ a depth first search algorithm to detect unique connected components
function getUnmarkedUngroupedNodes() {
    var unmarkedNodes = [];
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];

        if (node.marked == false) unmarkedNodes.push(node);
    }
    return unmarkedNodes;
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

//
//****




//****
// These methods are used to generate graphs compatible with JSNetworkX

function convertGraphForNetX() {
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

    this.G = G;
}

function getSimpleShortestPathDist(G,source, target) {
    var array = [];
    array[0] = jsnx.bidirectional_shortest_path(G,source,target);
    array[1] = array[0].length - 1;
    return array;
}


// BETWEENNESS CENTRALITY MUST BE FIXED TO ACCOUNT FOR POST-VACCINATION
function computeBetweennessCentrality() {
    var bc = jsnx.betweenness_centrality(G);
    var bcScores = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        bcScores[i] = bc[i];
        graph.nodes[i].bcScore = bc[i];
        originalGraph.nodes[i].bcScore = bc[i];
    }

    return bcScores;

}





