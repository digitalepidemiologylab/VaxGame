var vaccinateMode = true;
var treatMode = false;
var quarantineMode = false;
var vaccineSupply = 0;
var vaccineResearched = true;
var outbreakDetected = false;
var toggleDegree = false;
var toggleCentrality = false;

d3.select("body").append("div0")

var widthBay = 500;
var heightBay = 125;

// the svg canvas
var svgBay = d3.select("div0").append("svg")
    .attr("width", widthBay)
    .attr("height", heightBay)
    .append("g");

var researchVaccineButton = d3.superformula()
    .type("ellipse")
    .size(12000)
    .segments(360)

var researchLegend = d3.select("div0").select("svg").append("text")
    .text("Research Vaccine")
    .attr("x", 17)
    .attr("y", -5)
    .style("font-size", 14);

svgBay.append("path")
    .attr("class", "researchVaccineButton")
    .attr("d", researchVaccineButton)
    .style("fill", "red")
    .style("stroke", 10)
    .attr("transform", "translate(85,-7)")
    .on("click", researchVaccineButtonAttributes);



function researchVaccineButtonAttributes() {
    vaccineResearched = true;
    vaccineSupply = 5;

    d3.select("div0").select("svg").select("text")
        .text("Vaccine Researched")

    d3.select(this)
        .transition()
        .duration(500)
        .style("fill", "lightgrey")
        .attr("d", researchVaccineButton.type("rectangle"))
        .attr("d", researchVaccineButton.size(13000));



}




// user interface / interactive legend

// medical mode toggle button
var shape = d3.superformula()
    .type("gear")
    .size(1400)
    .segments(360)

var svgToggle = d3.select("body").select("svg")
    .attr("width", 800)
    .attr("heigth", 100)
    .append("g");

svgToggle.append("path")
    .attr("class", "shape")
    .attr("d", shape)
    .style("fill", "yellow")
    .style("stroke", 10)
    .on("click", transitionShape)
    .attr("transform", "translate(50,25)");

var medicalModeLegend = d3.select("body").select("svg")
    .append("text")
    .text(medicalModeTextReturn())
    .attr("x", 15)
    .attr("y", -10)
    .style("font-size", 14);


function medicalModeTextReturn() {
    if (vaccinateMode) return "Vaccinate";
    if (quarantineMode) return "Quarantine";
    if (treatMode) return "Treat";
}


function transitionShape() {
    updateMedicalMode();

    d3.select("text")
        .text(medicalModeTextReturn());

    d3.select(this)
        .transition()
        .duration(500)
        .style("fill", chooseColor)
        .attr("d", shape.type(chooseShape));

    updateNodeAttributes();

//    console.log(vaccinateMode + "\t" + quarantineMode + "\t" + treatMode);
}

function chooseColor() {
    if (vaccinateMode) return "yellow";
    if (quarantineMode) return "green";
    if (treatMode) return "red";
}

function chooseShape() {
    if (vaccinateMode) return "gear";
    if (quarantineMode) return "clover";
    if (treatMode) return "cross";
}

function updateMedicalMode() {
    if (vaccinateMode == true) {
        if (!diseaseIsSpreading) return;
        vaccinateMode = false;
        quarantineMode = true;
        treatMode = false;
        return;
    }

    if (quarantineMode == true) {
        vaccinateMode = false;
        quarantineMode = false;
        treatMode = true;
        return;
    }

    if (treatMode == true) {
        vaccinateMode = true;
        quarantineMode = false;
        treatMode = false;

        if (vaccineSupply <= 0) {
            vaccinateMode = false;
            quarantineMode = true;
        }

        return;
    }
}

var toggleDegreeShapes = d3.superformula()
    .type("circle")
    .size(500)
    .segments(360)

svgToggle.append("path")
    .attr("class", "toggleDegreeShapes")
    .attr("d", toggleDegreeShapes)
    .style("fill", "black")
    .style("stroke", 10)
    .on("click", toggleDegreeAttributes)
    .attr("transform", "translate(50,450)");

function toggleDegreeAttributes() {

    toggleDegree = !toggleDegree;

    if (toggleDegree) {
        d3.select(this)
            .transition()
            .duration(500)
            .style("fill", "blue")
            .attr("d", toggleDegreeShapes.type("asterisk"));


    }
    else {
        d3.select(this)
            .transition()
            .duration(500)
            .style("fill", "black")
            .attr("d", toggleDegreeShapes.type("circle"));

    }
    updateNodeAttributes();


}

var toggleCentralityShapes = d3.superformula()
    .type("circle")
    .size(500)
    .segments(360)

svgToggle.append("path")
    .attr("class", "toggleCentralityShapes")
    .attr("d", toggleCentralityShapes)
    .style("fill", "black")
    .style("stroke", 10)
    .on("click", toggleCentralityAttributes)
    .attr("transform", "translate(750,450)");

function toggleCentralityAttributes() {
    toggleCentrality = !toggleCentrality;

    if (toggleCentrality) {
        d3.select(this)
            .transition()
            .duration(500)
            .style("fill", "purple")
            .attr("d", toggleCentralityShapes.type("asterisk"));


    }
    else {
        d3.select(this)
            .transition()
            .duration(500)
            .style("fill", "black")
            .attr("d", toggleCentralityShapes.type("circle"));

    }
    updateNodeAttributes();
}

var detectOutbreakShape = d3.superformula()
    .type("circle")
    .size(1400)
    .segments(360)

var detectLegend = d3.select("body").select("svg").append("text")
    .attr("class", "textDetect")
    .text("Detect Outbreak")
    .attr("x", 660)
    .attr("y", -5)
    .style("font-size", 14);

svgToggle.append("path")
    .attr("class", "detectShape")
    .attr("d", detectOutbreakShape)
    .style("fill", "black")
    .style("stroke", 10)
    .attr("transform", "translate(725,35)")
    .on("click", detectOutbreakAttributes);


function detectOutbreakAttributes() {
    d3.select(this)
        .transition()
        .duration(300)
        .style("fill", "yellow")
        .style("opacity", 0.35)
    .attr("d", detectOutbreakShape.size(10000000));

    window.setTimeout(waitToShrink, 300);

    if (diseaseIsSpreading) {
            if (Math.random() < 0.75) {
                outbreakDetected = true;
                d3.select(".textDetect")
                    .text("Outbreak Detected!");
            }
        }
    runTimesteps();
    updateGraph();

}

function waitToShrink() {

    if (outbreakDetected == true) {
        d3.select(".detectShape")
            .transition()
            .duration(100)
            .style("fill", "black")
            .style("opacity", 1)
            .attr("d", detectOutbreakShape.size(0));

    }
    else {
        d3.select(".detectShape")
            .transition()
            .duration(100)
            .style("fill", "black")
            .style("opacity", 1)
            .attr("d", detectOutbreakShape.size(1400));
    }

}


var centraltiyLegend = d3.select("body").select("svg")
    .append("text")
    .text("Size By Centrality")
    .attr("x", 585)
    .attr("y", 456)
    .style("font-size", 14);

var degreeLegend = d3.select("body").select("svg")
    .append("text")
    .text("Size By Popularity")
    .attr("x", 80)
    .attr("y", 456)
    .style("font-size", 14);


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

function click(node) {
    if (vaccinateMode && vaccineSupply > 0)  {
        vaccinateAction(node);
        updateNodeAttributes();
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


//function mouseOver(node) {
//    div.transition()
//        .duration(200)
//        .style("opacity", .9);
//    div.html("NodeID:\t" + node.id + "<br/>" + "Neighbors:\t" +  degree(node) + "<br/>"  + "Centrality:\t" + parseFloat(Math.round(node.bcScore * 100) / 100).toFixed(2))
//        .style("left", 500 + "px")
//        .style("top", 200 + "px");
//}
//
//
//function mouseOut(node) {
//    div.transition()
//        .duration(400)
//        .style("opacity", 0)
//
//}

