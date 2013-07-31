var vaccinateMode = true;
var treatMode = false;
var quarantineMode = false;
var sizeByDegree = false;
var sizeByBC = false;
var vaccineSupply = 0;
var recentUpdate = "New Pathogen Detected! Consider Researching a Vaccine.";
var previousUpdates = [];
var lastUpdateTimestep = 0;
var vaccineResearched = true;
var outbreakDetected = false;


function makePublicAnnouncement() {
    for (var i = 0; i < graph.nodes.length; i++) {
        var individual = graph.nodes[i];
        if (Math.random() < 0.10) voluntarilySegregateIndividual(individual);
        if (Math.random() > (1.0 - rateOfRefusalAdoption)) makeRefuser(individual);
    }
}

function voluntarilySegregateIndividual(individual) {
    individual.status = "VOL";
}

function makeRefuser(individual) {
    individual.status = "REF";

}

function declareMartialLaw() {
    var links = graph.links;

    for (var i = 0; i < links.length; i++) {
        if (Math.random() < martialLaw_edgeRemovalFrequency) {
            var linkToRemove = findLink(links[i].source, links[i].target);

            try {
                linkToRemove.remove = true;
            }
            catch(e) {
                //catch and just suppress errors
            }
        }
    }

    graph.links = links;
}


function toggleSizeByDegree() {
    sizeByDegree = !sizeByDegree;
    updateNodeAttributes();
}

function toggleSizeByBC() {
    sizeByBC = !sizeByBC;
    updateNodeAttributes();
}

function toggleVaccinate() {
    if (vaccinateMode == false) {
        vaccinateMode = true;
        treatMode = false;
        quarantineMode = false;
    }
}

function toggleTreatment() {
    if (treatMode == false) {
        treatMode = true;
        vaccinateMode = false;
        quarantineMode = false;
    }
}

function toggleQuarantine() {
    if (quarantineMode == false) {
        quarantineMode = true;
        treatMode = false;
        vaccinateMode = false;
    }
}


function click(node) {
    if (vaccinateMode && vaccineSupply > 0)  {
        vaccinateAction(node);
        updateNodeAttributes();
        runTimesteps();
    }

    else {
        if (vaccinateMode == true && vaccineSupply == 0) {
            window.alert("No more vaccines!")
            return;
        }
        if (quarantineMode) quarantineAction(node);
        else (treatAction(node));
        runTimesteps();
        updateGraph();
    }

}

function startGame() {
    selectIndexCase();
    selectIndexCase();
    diseaseIsSpreading = true;
    updateGraph();
    vaccinateMode = false;
    quarantineMode = true;
    treatMode = false;
}

function vaccinateAction(node) {
    if (node.status == "V" || node.status == "I" || node.status == "R") return;
    if (node.status == "S") {
        vaccineSupply--;
        node.status = "V";
    }
}

function quarantineAction(node) {
    if (node.status == "V" || node.status == "I" || node.status == "R" || node.status == "REF") return;
    if (node.status == "S") node.status = "Q";
}

function treatAction(node) {
    if (node.status == "V" || node.status == "R") return;
    if (node.status == "I") treatInfected(node);
}


function mouseOver(node) {
    div.transition()
        .duration(200)
        .style("opacity", .9);
    div.html("NodeID:\t" + node.id + "<br/>" + "Neighbors:\t" +  degree(node) + "<br/>"  + "Centrality:\t" + parseFloat(Math.round(node.bcScore * 100) / 100).toFixed(2))
        .style("left", 500 + "px")
        .style("top", 200 + "px");
}


function mouseOut(node) {
    div.transition()
        .duration(400)
        .style("opacity", 0)

}

function setRecentUpdate(updateString) {

    if (updateString == recentUpdate) return;

    var previousUpdateData = {string:recentUpdate, timestep:lastUpdateTimestep}

    previousUpdates.push(previousUpdateData);

    recentUpdate = updateString;
    lastUpdateTimestep = timestep;

}
