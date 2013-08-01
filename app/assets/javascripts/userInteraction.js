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

d3.select("body").append("div0")

var widthBay = 500;
var heightBay = 125;

// the svg canvas
var svgBay = d3.select("div0").append("svg")
    .attr("width", widthBay)
    .attr("height", heightBay)
    .append("g");

// single research vaccination button
var researchVaccineButton = d3.select("div0").select("svg")
    .append("rect")
    .attr("x", 25)
    .attr("y", 25)
    .attr("width", 50)
    .attr("height", 30)

// this pops-in two new buttons (make announcement, declare martial law, etc)
var policyOption = d3.select("div0").select("svg")
    .append("rect")
    .attr("x", 150)
    .attr("y", 25)
    .attr("width", 50)
    .attr("height", 30)

// toggle mode...transitions between different shapes and colors and text to indicate mode (vaccination, quarantine, and treatment)
var medicalModeSelection = d3.select("div0").select("svg")
    .append("rect")
    .attr("x", 275)
    .attr("y", 25)
    .attr("width", 50)
    .attr("height", 30)

var sizeByDegreeToggle = d3.select("body").select("svg")
    .append("circle")
    .attr("cx", 675)
    .attr("cy", -40)
    .attr("r", 12)
    .on("click", function() {
        toggleSizeByDegree();
        d3.select(this)
            .attr("fill", function() {
                if (currentColorDeg == "black") {
                    currentColorDeg = "blue";
                    return "blue";
                }
                if (currentColorDeg == "blue") {
                    currentColorDeg = "black";
                    return "black";
                }
            });

    });

var degreeLegend = d3.select("body").select("svg")
    .append("text")
    .text("Size By Popularity")
    .attr("x", 515)
    .attr("y", -35)
    .style("font-size", 14);

var centralityLegend = d3.select("body").select("svg")
    .append("text")
    .text("Size By Centrality")
    .attr("x", 160)
    .attr("y", -35)
    .style("font-size", 14);

var sizeByCentralityToggle = d3.select("body").select("svg")
    .append("circle")
    .attr("cx", 140)
    .attr("cy", -40)
    .attr("r", 12)
    .on("click", function() {
        toggleSizeByBC();
        d3.select(this)
            .attr("fill", function() {
                if (currentColorBC == "black") {
                    currentColorBC = "blue";
                    return "blue";
                }
                if (currentColorBC == "blue") {
                    currentColorBC = "black";
                    return "black";
                }
            });
    });



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
