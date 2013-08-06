var outbreakDetected = false;

var vaccineResearched = false;
var vaccineSupply = 0;

var epidemicAnnounced = false;
var newRefusers = 0;
var newAdopters = 0;

var martialLawDeclared = false;
var brokenTies = 0;

var vaccinateMode = true;
var treatMode = false;
var quarantineMode = false;

var toggleDegree = false;
var toggleCentrality = false;

d3.select("body").append("div0")

var widthBay = 500;
var heightBay = 250;

// the svg canvas
var svgBay = d3.select("div0").append("svg")
    .attr("class", "svgBay")
    .attr("width", widthBay)
    .attr("height", heightBay)
    .append("g");


// main box that displays text of currently selected policy option
var policyBox = d3.select(".svgBay").append("rect")
    .attr("x", 15).attr("y", 25)
    .attr("height", 100).attr("width", 150)
    .attr("class", "policyBox")
    .style("fill", "red");

var policyText = d3.select(".svgBay").append("text")
    .attr("x", 68).attr("y", 20)
    .attr("class", "policyText")
    .text("Policy")
    .style("font-weight", "bold");

var selectedPolicyText1 = d3.select(".svgBay").append("text")
    .attr("x", 35).attr("y", 45)
    .attr("class", "selectedPolicyText1")
    .text("A new virus has")

var selectedPolicyText2 = d3.select(".svgBay").append("text")
    .attr("x", 39).attr("y", 65)
    .attr("class", "selectedPolicyText2")
    .text("been detected.")

var selectedPolicyText3 = d3.select(".svgBay").append("text")
    .attr("x", 62).attr("y", 95)
    .attr("class", "selectedPolicyText3")
    .text("Click to")
    .on("click", researchVaccine)

var selectedPolicyText4 = d3.select(".svgBay").append("text")
    .attr("x", 28).attr("y", 115)
    .attr("class", "selectedPolicyText4")
    .text("Research Vaccine.")
    .on("click", researchVaccine)


// main box that displays text of currently selected medical option
var medicineBox = d3.select(".svgBay").append("rect")
    .attr("x", 185).attr("y", 25)
    .attr("height", 100).attr("width", 150)
    .attr("class", "medicineBox")
    .style("fill", "orange");

var medicineText = d3.select(".svgBay").append("text")
    .attr("x", 222).attr("y", 20)
    .attr("class", "medicineText")
    .text("Treatment")
    .style("font-weight", "bold");

var selectedMedicineText1 = d3.select(".svgBay").append("text")
    .attr("x", 200).attr("y", 50)
    .attr("class", "selectedMedicineText1")
    .text("")

var selectedMedicineText2 = d3.select(".svgBay").append("text")
    .attr("x", 250).attr("y", 80)
    .attr("class", "selectedMedicineText2")
    .text("")

var selectedMedicineText3 = d3.select(".svgBay").append("text")
    .attr("x", 235).attr("y", 110)
    .attr("class", "selectedMedicineText3")
    .text("")


// main box that displays text of currently selected intel option
var intelBox = d3.select(".svgBay").append("rect")
    .attr("x", 355).attr("y", 25)
    .attr("height", 100).attr("width", 150)
    .attr("class", "intelBox")
    .style("fill", "lightblue");

var intelText = d3.select(".svgBay").append("text")
    .attr("x", 383).attr("y", 20)
    .attr("class", "intelText")
    .text("Visualization")
    .style("font-weight", "bold");

var selectedIntelText1 = d3.select(".svgBay").append("text")
    .attr("x", 365).attr("y", 45)
    .attr("class", "selectedIntelText1")
    .text("Individual Size By:")

var selectedIntelText2 = d3.select(".svgBay").append("text")
    .attr("x", 393).attr("y", 65)
    .attr("class", "selectedIntelText2")
    .attr("opacity", 0)
    .text("Popularity")

var selectedIntelText3 = d3.select(".svgBay").append("text")
    .attr("x", 420).attr("y", 85)
    .attr("class", "selectedIntelText3")
    .attr("opacity", 0)
    .text("&")

var selectedIntelText4 = d3.select(".svgBay").append("text")
    .attr("x", 393).attr("y", 105)
    .attr("class", "selectedIntelText4")
    .attr("opacity", 0)
    .text("Centrality")

// policy option text selectors

var detectOutbreakSelect = d3.select(".svgBay").append("text")
    .attr("x", 33).attr("y", 155)
    .attr("class", "detectOutbreakSelect")
    .text("Detect Outbreak")
    .attr("opacity", 0.35)
    .on("click", detectOutbreakActions)

var detectOutbreakGear = d3.superformula()
    .type("gear")
    .size(0)
    .segments(360)

var detectOutbreakStar = d3.superformula()
    .type("star")
    .size(70)
    .segments(360)

d3.select(".svgBay").append("path")
    .attr("class", "detectOutbreakStar")
    .attr("d", detectOutbreakStar)
    .attr("opacity", 0)
    .style("fill", "yellow")
    .style("stroke", 2)
    .attr("transform", "translate(12,149)")

d3.select(".networkSVG").append("path")
    .attr("class", "detectOutbreakGear")
    .attr("d", detectOutbreakGear)
    .attr("opacity", 0)
    .style("fill", "yellow")
    .style("stroke", 25)
    .attr("transform", "translate(250,250)")

function detectOutbreakActions() {
    d3.select(".detectOutbreakGear")
        .transition()
        .duration(800)
        .attr("opacity", 0.75)
        .attr("d", detectOutbreakGear.size(10000000));

    window.setTimeout(waitToShrinkDetectionButton, 600);

    if (diseaseIsSpreading) {
        if (Math.random() > 0.25) {
            outbreakDetected = true;

            d3.select(".selectedPolicyText1")
                .attr("x", 17).attr("y", 78)
                .style("font-weight", "bold")
                .text("Outbreak Detected!")

            d3.select(".selectedPolicyText2")
                .attr("x", 23).attr("y", 75)
                .text("")

            d3.select(".selectedPolicyText3")
                .attr("x", 20).attr("y", 100)
                .text("")

            d3.select(".selectedPolicyText4").text("");

            selectQuarantineMode();

            d3.select(".detectOutbreakSelect")
                .attr("font-weight", "bold")
                .attr("x", 22)
                .text("Outbreak Detected")

            d3.select(".detectOutbreakStar")
                .attr("opacity", 1)

            d3.select(".announceOutbreakSelect")
                .attr("opacity", 1)

            d3.select(".martialLawSelect")
                .attr("opacity", 1)


        }
    }
    runTimesteps();
    updateGraph();
}

function waitToShrinkDetectionButton() {
    d3.select(".detectOutbreakGear")
        .transition()
        .duration(350)
        .attr("d", detectOutbreakGear.size(0));

}


function researchVaccine() {
    if (vaccineResearched) return;
    vaccineResearched = true;
    vaccineSupply = numberOfIndividuals * 0.10;

    d3.select(this)
        .attr("font-weight", "bold")
        .attr("x", 22)
        .text("Vaccine Researched")

    d3.select(".researchStar")
        .attr("opacity", 1)

    d3.select(".selectedPolicyText1")
        .attr("x", 17).attr("y", 45)
        .style("font-weight", "bold")
        .text("Vaccine Researched")

    d3.select(".selectedPolicyText2")
        .attr("x", 23).attr("y", 75)
        .text("Vaccine Supply +5")

    d3.select(".selectedPolicyText3")
        .attr("x", 20).attr("y", 100)
        .text("Production +0.5/day")

    d3.select(".selectedPolicyText4").text("");

    d3.select(".detectOutbreakSelect")
        .attr("opacity", 1)



    selectVaccinateMode();


}

var announceOutbreakSelect = d3.select(".svgBay").append("text")
    .attr("x", 12).attr("y", 185)
    .attr("class", "announceOutbreakSelect")
    .text("Announce an Epidemic")
    .attr("opacity", 0.35)
    .on("click", announceOutbreak)

var announceStar = d3.superformula()
    .type("star")
    .size(70)
    .segments(360)

svgBay.append("path")
    .attr("class", "announceStar")
    .attr("d", announceStar)
    .attr("opacity", 0)
    .style("fill", "yellow")
    .style("stroke", 2)
    .attr("transform", "translate(12,181)")

function announceOutbreak() {
    if (epidemicAnnounced) return;
    if (!diseaseIsSpreading) {
        window.alert("No Outbreak Detected")
        return;
    }
    epidemicAnnounced = true;

    d3.select(this)
        .attr("font-weight", "bold")
        .attr("x", 22)
        .text("Epidemic Announced")

    d3.select(".announceStar")
        .attr("opacity", 1);

    makePublicAnnouncement();

    d3.select(".selectedPolicyText1").attr("x", 35).attr("y", 50).style("font-weight", "bold").text("Announcement")
    d3.select(".selectedPolicyText2").attr("x", 26).attr("y", 75).text("Staying Indoors : " + newAdopters)
    d3.select(".selectedPolicyText3").attr("x", 26).text("Refused Vaccine: " + newRefusers)
    d3.select(".selectedPolicyText4").text("")

    updateNodeAttributes();


}





// martial law selector, indicator, and function
var martialLawSelect = d3.select(".svgBay").append("text")
    .attr("x", 22).attr("y", 215)
    .attr("class", "martialLawSelect")
    .text("Declare Martial Law")
    .attr("opacity", 0.35)
    .on("click", clickMartial);

var martialStar = d3.superformula()
    .type("star")
    .size(70)
    .segments(360)

svgBay.append("path")
    .attr("class", "martialStar")
    .attr("d", martialStar)
    .style("fill", "yellow")
    .style("stroke", 2)
    .attr("opacity", 0)
    .attr("transform", "translate(12,210)")

function clickMartial() {
    if (martialLawDeclared) return;
    if (!diseaseIsSpreading) {
        window.alert("No Outbreak Detected")
        return;
    }

    martialLawDeclared = true;

    d3.select(this)
        .style("font-weight", "bold")
        .text("Martial Law Declared")

    d3.select(".martialStar")
        .attr("opacity", 1);

    declareMartialLaw();

    d3.select(".selectedPolicyText1").attr("x", 47).style("font-weight", "bold").text("Martial Law")
    d3.select(".selectedPolicyText2").attr("x", 35).attr("y", 85).text("Ties Broken: " + brokenTies)
    d3.select(".selectedPolicyText3").text("")
    d3.select(".selectedPolicyText4").text("")

    updateGraph();

}

//treat option text selectors

var vaccinateSelect = d3.select(".svgBay").append("text")
    .attr("x", 225).attr("y", 155)
    .attr("class", "vaccinateSelect")
    .text("Vaccinate")
    .attr("opacity", 0.35)
    .on("click", selectVaccinateMode);

function selectVaccinateMode() {
    vaccinateMode = true;
    quarantineMode = false;
    treatMode = false;

    d3.select(".selectedMedicineText1").text("Click an Individual");
    d3.select(".selectedMedicineText2").text("to");
    d3.select(".selectedMedicineText3").attr("x", 228).text("Vaccinate");

    d3.select(".vaccinateSelect").attr("font-weight", "bold").attr("opacity", 1);
    d3.select(".quarantineSelect").attr("font-weight", "normal")
    d3.select(".treatSelect").attr("font-weight", "normal")

}

var quarantineSelect = d3.select(".svgBay").append("text")
    .attr("x", 221).attr("y", 185)
    .attr("class", "quarantineSelect")
    .text("Quarantine")
    .attr("opacity", 0.35)
    .on("click", selectQuarantineMode);

function selectQuarantineMode() {
    vaccinateMode = false;
    quarantineMode = true;
    treatMode = false;


    d3.select(".selectedMedicineText1").text("Click an Individual");
    d3.select(".selectedMedicineText2").text("to");
    d3.select(".selectedMedicineText3").attr("x", 221).text("Quarantine");

    d3.select(".vaccinateSelect").attr("font-weight", "normal");
    d3.select(".quarantineSelect").attr("font-weight", "bold").attr("opacity", 1);

    d3.select(".treatSelect").attr("font-weight", "normal").attr("opacity", 1)




}

var treatSelect = d3.select(".svgBay").append("text")
    .attr("x", 238).attr("y", 215)
    .attr("class", "treatSelect")
    .text("Treat")
    .attr("opacity", 0.35)
    .on("click", selectTreatMode);

function selectTreatMode() {
    vaccinateMode = false;
    quarantineMode = false;
    treatMode = true;

    d3.select(".selectedMedicineText1").text("Click an Individual");
    d3.select(".selectedMedicineText2").text("to");
    d3.select(".selectedMedicineText3").attr("x", 240).text("Treat");

    d3.select(".vaccinateSelect").attr("font-weight", "normal");
    d3.select(".quarantineSelect").attr("font-weight", "normal")
    d3.select(".treatSelect").attr("font-weight", "bold")

}



//intel option text selectors

var popularitySelect = d3.select(".svgBay").append("text")
    .attr("x", 392).attr("y", 165)
    .attr("class", "popularitySelect")
    .text("Popularity")
    .on("click", selectPopularity);

function selectPopularity() {
    toggleDegree = !toggleDegree;

    if (toggleDegree) {
        d3.select(".popularitySelect")
            .attr("font-weight", "bold")

        if (toggleCentrality) {
            d3.select(".selectedIntelText2").attr("opacity", 1)
            d3.select(".selectedIntelText3").attr("opacity", 1)
            d3.select(".selectedIntelText4").attr("opacity", 1)
        }

        if (!toggleCentrality) {
            d3.select(".selectedIntelText2").attr("opacity", 1)
            d3.select(".selectedIntelText3").attr("opacity", 0)
            d3.select(".selectedIntelText4").attr("opacity", 0)
        }

    }
    if (!toggleDegree) {
        d3.select(".popularitySelect")
            .attr("font-weight", "normal")

        if (toggleCentrality) {
            d3.select(".selectedIntelText2").attr("opacity", 0)
            d3.select(".selectedIntelText3").attr("opacity", 0)
            d3.select(".selectedIntelText4").attr("opacity", 1)
        }

        if (!toggleCentrality) {
            d3.select(".selectedIntelText2").attr("opacity", 0)
            d3.select(".selectedIntelText3").attr("opacity", 0)
            d3.select(".selectedIntelText4").attr("opacity", 0)
        }
    }


    updateNodeAttributes();

}

var centralitySelect = d3.select(".svgBay").append("text")
    .attr("x", 392).attr("y", 200)
    .attr("class", "centralitySelect")
    .text("Centrality")
    .on("click", selectCentrality);

function selectCentrality() {
    toggleCentrality = !toggleCentrality;

    if (toggleCentrality) {
        d3.select(".centralitySelect")
            .attr("font-weight", "bold")

        if (toggleDegree) {
            d3.select(".selectedIntelText2").attr("opacity", 1)
            d3.select(".selectedIntelText3").attr("opacity", 1)
            d3.select(".selectedIntelText4").attr("opacity", 1)
        }

        if (!toggleDegree) {
            d3.select(".selectedIntelText2").attr("opacity", 0)
            d3.select(".selectedIntelText3").attr("opacity", 0)
            d3.select(".selectedIntelText4").attr("opacity", 1)
        }

    }
    if (!toggleCentrality) {
        d3.select(".centralitySelect")
            .attr("font-weight", "normal")

        if (toggleDegree) {
            d3.select(".selectedIntelText2").attr("opacity", 1)
            d3.select(".selectedIntelText3").attr("opacity", 0)
            d3.select(".selectedIntelText4").attr("opacity", 0)
        }

        if (!toggleDegree) {
            d3.select(".selectedIntelText2").attr("opacity", 0)
            d3.select(".selectedIntelText3").attr("opacity", 0)
            d3.select(".selectedIntelText4").attr("opacity", 0)
        }
    }

    updateNodeAttributes();


}


function bold_underline() {
    d3.select(this)
        .style("font-weight", "bold");
}



function makePublicAnnouncement() {
    for (var i = 0; i < graph.nodes.length; i++) {
        var individual = graph.nodes[i];
        if (Math.random() < 0.10) {
            voluntarilySegregateIndividual(individual);
            newAdopters++;
        }
        if (Math.random() > (1.0 - rateOfRefusalAdoption)) {
            makeRefuser(individual);
            newRefusers++;
        }
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
                brokenTies++;
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

